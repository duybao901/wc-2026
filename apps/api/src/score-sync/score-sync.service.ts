import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleRepository } from '../schedule.repository';

export interface ProviderMatchResult {
  fifaMatchNo?: number;
  homeTeam?: string;
  awayTeam?: string;
  homeScore: number;
  awayScore: number;
  status: 'finished';
}

export interface ScoreSyncSummary {
  enabled: boolean;
  providerUrlConfigured: boolean;
  startedAt: string;
  finishedAt: string;
  reason: string;
  fetched: number;
  updated: number;
  skipped: number;
  errors: string[];
}

type ProviderPayload = unknown;
type SyncPhase = 'pre-match' | 'live' | 'final-window' | 'post-match' | 'delayed-final';

export interface SyncDecision {
  shouldSync: boolean;
  reason: string;
  phase?: SyncPhase;
  candidates: number;
  intervalMinutes?: number;
}

@Injectable()
export class ScoreSyncService implements OnModuleInit {
  private readonly logger = new Logger(ScoreSyncService.name);
  private lastRun: ScoreSyncSummary | null = null;
  private lastDecision: SyncDecision | null = null;
  private lastExternalSyncAt: Date | null = null;
  private dailyRequestCount = 0;
  private dailyRequestDate = this.getQuotaDateKey(new Date());
  private minuteRequestCount = 0;
  private minuteWindowStartedAt = this.getMinuteWindowKey(new Date());
  private running = false;

  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async onModuleInit() {
    if (process.env.SCORE_SYNC_ON_START === 'true') {
      await this.syncOnce();
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncOnSchedule() {
    if (process.env.SCORE_SYNC_ENABLED !== 'true') {
      return;
    }

    await this.syncWhenUseful();
  }

  getStatus() {
    return {
      enabled: process.env.SCORE_SYNC_ENABLED === 'true',
      providerUrlConfigured: Boolean(process.env.SCORE_SYNC_URL),
      scheduler: 'checks every 1 minute; external calls are quota-aware',
      dailyLimit: this.getDailyRequestLimit(),
      dailyRequestCount: this.dailyRequestCount,
      minuteLimit: this.getMinuteRequestLimit(),
      minuteRequestCount: this.minuteRequestCount,
      minuteWindowStartedAt: this.minuteWindowStartedAt,
      lastDecision: this.lastDecision,
      lastExternalSyncAt: this.lastExternalSyncAt?.toISOString() ?? null,
      lastRun: this.lastRun,
      running: this.running
    };
  }

  async syncWhenUseful(): Promise<ScoreSyncSummary | null> {
    const decision = await this.getSyncDecision(new Date());
    this.lastDecision = decision;

    if (!decision.shouldSync) {
      return null;
    }

    return this.syncOnce(decision.reason);
  }

  async syncOnce(reason = 'manual'): Promise<ScoreSyncSummary> {
    if (this.running) {
      return this.createSummary({
        fetched: 0,
        updated: 0,
        skipped: 0,
        errors: ['Score sync is already running']
      }, reason);
    }

    this.running = true;
    const startedAt = new Date().toISOString();
    const errors: string[] = [];
    let fetched = 0;
    let updated = 0;
    let skipped = 0;

    try {
      if (!process.env.SCORE_SYNC_URL) {
        errors.push('SCORE_SYNC_URL is not configured');
      } else if (!this.canUseExternalRequest()) {
        errors.push(this.getQuotaBlockReason());
      } else {
        this.recordExternalRequest();
        const payload = await this.fetchProviderPayload(process.env.SCORE_SYNC_URL);
        this.lastExternalSyncAt = new Date();
        const results = normalizeProviderResults(payload);
        fetched = results.length;

        for (const result of results) {
          const saved = result.fifaMatchNo
            ? await this.scheduleRepository.updateResult(result.fifaMatchNo, {
                homeScore: result.homeScore,
                awayScore: result.awayScore
              })
            : result.homeTeam && result.awayTeam
              ? await this.scheduleRepository.updateResultByTeams({
                  homeTeam: normalizeTeamName(result.homeTeam),
                  awayTeam: normalizeTeamName(result.awayTeam),
                  homeScore: result.homeScore,
                  awayScore: result.awayScore
                })
              : null;

          if (saved) {
            updated += 1;
          } else {
            skipped += 1;
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown score sync error';
      errors.push(message);
      this.logger.error(message);
    } finally {
      this.running = false;
    }

    const summary: ScoreSyncSummary = {
      enabled: process.env.SCORE_SYNC_ENABLED === 'true',
      providerUrlConfigured: Boolean(process.env.SCORE_SYNC_URL),
      startedAt,
      finishedAt: new Date().toISOString(),
      reason,
      fetched,
      updated,
      skipped,
      errors
    };

    this.lastRun = summary;
    return summary;
  }

  private async fetchProviderPayload(url: string): Promise<ProviderPayload> {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    };
    const apiKey = process.env.SCORE_SYNC_API_KEY;

    if (apiKey) {
      headers[process.env.SCORE_SYNC_AUTH_HEADER ?? 'x-apisports-key'] = apiKey;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Provider request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private createSummary(partial: Pick<ScoreSyncSummary, 'fetched' | 'updated' | 'skipped' | 'errors'>, reason = 'skipped') {
    const now = new Date().toISOString();

    return {
      enabled: process.env.SCORE_SYNC_ENABLED === 'true',
      providerUrlConfigured: Boolean(process.env.SCORE_SYNC_URL),
      startedAt: now,
      finishedAt: now,
      reason,
      ...partial
    };
  }

  private async getSyncDecision(now: Date): Promise<SyncDecision> {
    if (!process.env.SCORE_SYNC_URL) {
      return {
        shouldSync: false,
        reason: 'SCORE_SYNC_URL is not configured',
        candidates: 0
      };
    }

    if (!this.canUseExternalRequest()) {
      return {
        shouldSync: false,
        reason: this.getQuotaBlockReason(),
        candidates: 0
      };
    }

    const candidates = await this.scheduleRepository.getScoreSyncCandidates(now);
    const phases = candidates.map((match) => getMatchSyncPhase(match.kickoffAt, now)).filter(Boolean);
    const phase = pickMostUrgentPhase(phases);

    if (!phase) {
      return {
        shouldSync: false,
        reason: 'No scheduled match is close enough to kickoff or full-time',
        candidates: candidates.length
      };
    }

    const intervalMinutes = this.getIntervalForPhase(phase);

    if (this.lastExternalSyncAt) {
      const elapsedMs = now.getTime() - this.lastExternalSyncAt.getTime();
      const waitMs = intervalMinutes * 60_000;

      if (elapsedMs < waitMs) {
        return {
          shouldSync: false,
          reason: `${phase} sync throttled for ${intervalMinutes} minutes`,
          phase,
          candidates: candidates.length,
          intervalMinutes
        };
      }
    }

    return {
      shouldSync: true,
      reason: `${phase} sync window`,
      phase,
      candidates: candidates.length,
      intervalMinutes
    };
  }

  private getIntervalForPhase(phase: SyncPhase) {
    const envKeyByPhase: Record<SyncPhase, string> = {
      'pre-match': 'SCORE_SYNC_PRE_MATCH_INTERVAL_MINUTES',
      live: 'SCORE_SYNC_LIVE_INTERVAL_MINUTES',
      'final-window': 'SCORE_SYNC_FINAL_INTERVAL_MINUTES',
      'post-match': 'SCORE_SYNC_POST_MATCH_INTERVAL_MINUTES',
      'delayed-final': 'SCORE_SYNC_DELAYED_INTERVAL_MINUTES'
    };
    const defaults: Record<SyncPhase, number> = {
      'pre-match': 30,
      live: 10,
      'final-window': 3,
      'post-match': 15,
      'delayed-final': 60
    };
    const value = Number(process.env[envKeyByPhase[phase]] ?? defaults[phase]);

    return Number.isFinite(value) && value > 0 ? value : defaults[phase];
  }

  private canUseExternalRequest() {
    this.resetQuotaIfNeeded(new Date());

    return (
      this.dailyRequestCount < this.getDailyRequestLimit() &&
      this.minuteRequestCount < this.getMinuteRequestLimit()
    );
  }

  private recordExternalRequest() {
    this.resetQuotaIfNeeded(new Date());
    this.dailyRequestCount += 1;
    this.minuteRequestCount += 1;
  }

  private resetQuotaIfNeeded(now: Date) {
    const dayKey = this.getQuotaDateKey(now);

    if (dayKey !== this.dailyRequestDate) {
      this.dailyRequestDate = dayKey;
      this.dailyRequestCount = 0;
    }

    const minuteKey = this.getMinuteWindowKey(now);

    if (minuteKey !== this.minuteWindowStartedAt) {
      this.minuteWindowStartedAt = minuteKey;
      this.minuteRequestCount = 0;
    }
  }

  private getDailyRequestLimit() {
    const limit = Number(process.env.SCORE_SYNC_DAILY_LIMIT ?? 95);

    return Number.isInteger(limit) && limit > 0 ? limit : 95;
  }

  private getMinuteRequestLimit() {
    const limit = Number(process.env.SCORE_SYNC_PER_MINUTE_LIMIT ?? 10);

    return Number.isInteger(limit) && limit > 0 ? limit : 10;
  }

  private getQuotaBlockReason() {
    this.resetQuotaIfNeeded(new Date());

    if (this.minuteRequestCount >= this.getMinuteRequestLimit()) {
      return `Per-minute score sync quota reached (${this.getMinuteRequestLimit()} calls/minute)`;
    }

    if (this.dailyRequestCount >= this.getDailyRequestLimit()) {
      return `Daily score sync quota reached (${this.getDailyRequestLimit()} requests)`;
    }

    return 'Score sync quota is not available';
  }

  private getQuotaDateKey(now: Date) {
    return now.toISOString().slice(0, 10);
  }

  private getMinuteWindowKey(now: Date) {
    return now.toISOString().slice(0, 16);
  }
}

export function getMatchSyncPhase(kickoffAt: Date, now: Date): SyncPhase | null {
  const minutesFromKickoff = Math.floor((now.getTime() - kickoffAt.getTime()) / 60_000);

  if (minutesFromKickoff >= -30 && minutesFromKickoff < 0) {
    return 'pre-match';
  }

  if (minutesFromKickoff >= 0 && minutesFromKickoff < 100) {
    return 'live';
  }

  if (minutesFromKickoff >= 100 && minutesFromKickoff < 135) {
    return 'final-window';
  }

  if (minutesFromKickoff >= 135 && minutesFromKickoff < 240) {
    return 'post-match';
  }

  if (minutesFromKickoff >= 240 && minutesFromKickoff < 2160) {
    return 'delayed-final';
  }

  return null;
}

function pickMostUrgentPhase(phases: Array<SyncPhase | null>): SyncPhase | undefined {
  const priority: SyncPhase[] = ['final-window', 'live', 'post-match', 'pre-match', 'delayed-final'];

  return priority.find((phase) => phases.includes(phase));
}

export function normalizeProviderResults(payload: ProviderPayload): ProviderMatchResult[] {
  const rows = extractRows(payload);

  return rows
    .map((row) => normalizeProviderRow(row))
    .filter((result): result is ProviderMatchResult => Boolean(result));
}

function extractRows(payload: ProviderPayload): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of ['matches', 'results', 'response', 'data']) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function normalizeProviderRow(row: unknown): ProviderMatchResult | null {
  if (!isRecord(row)) {
    return null;
  }

  const status = readString(row, ['status', 'matchStatus', 'state'])?.toLowerCase();
  const fixtureStatus = isRecord(row.fixture) ? readString(row.fixture, ['status.short', 'status.long'])?.toLowerCase() : null;
  const normalizedStatus = status ?? fixtureStatus;

  if (normalizedStatus && !['ft', 'finished', 'fulltime', 'full-time', 'match finished'].includes(normalizedStatus)) {
    return null;
  }

  const fifaMatchNo = readInteger(row, ['fifaMatchNo', 'matchNo', 'matchNumber', 'match_number']);
  const homeTeam = readString(row, ['homeTeam', 'home_team', 'homeTeam.name', 'teams.home.name']);
  const awayTeam = readString(row, ['awayTeam', 'away_team', 'awayTeam.name', 'teams.away.name']);
  const homeScore = readInteger(row, [
    'homeScore',
    'home_score',
    'score.home',
    'score.fullTime.home',
    'goals.home'
  ]);
  const awayScore = readInteger(row, [
    'awayScore',
    'away_score',
    'score.away',
    'score.fullTime.away',
    'goals.away'
  ]);

  if ((!fifaMatchNo && (!homeTeam || !awayTeam)) || homeScore === null || awayScore === null) {
    return null;
  }

  return {
    ...(fifaMatchNo ? { fifaMatchNo } : {}),
    ...(homeTeam ? { homeTeam } : {}),
    ...(awayTeam ? { awayTeam } : {}),
    homeScore,
    awayScore,
    status: 'finished'
  };
}

function readInteger(record: Record<string, unknown>, paths: string[]) {
  for (const path of paths) {
    const value = readPath(record, path);

    if (typeof value === 'number' && Number.isInteger(value)) {
      return value;
    }

    if (typeof value === 'string' && /^\d+$/.test(value)) {
      return Number(value);
    }
  }

  return null;
}

function readString(record: Record<string, unknown>, paths: string[]) {
  for (const path of paths) {
    const value = readPath(record, path);

    if (typeof value === 'string') {
      return value;
    }
  }

  return null;
}

function readPath(record: Record<string, unknown>, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!isRecord(current)) {
      return undefined;
    }

    return current[key];
  }, record);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTeamName(name: string) {
  const aliases: Record<string, string> = {
    'bosnia-herzegovina': 'Bosnia and Herzegovina',
    'bosnia & herzegovina': 'Bosnia and Herzegovina',
    'bosnia herzegovina': 'Bosnia and Herzegovina',
    czechia: 'Czech Republic',
    usa: 'United States',
    'united states of america': 'United States'
  };
  const key = name.trim().toLowerCase();

  return aliases[key] ?? name;
}
