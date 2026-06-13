import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

export interface TeamDto {
  name: string;
  position: number;
  flagEmoji: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupDto {
  code: string;
  name: string;
  teams: TeamDto[];
}

export interface MatchDto {
  id: number;
  fifaMatchNo: number;
  groupCode: string;
  matchday: number;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: string;
  venue: string;
  city: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface ScoreSyncCandidate {
  fifaMatchNo: number;
  kickoffAt: Date;
  status: string;
}

interface TeamStats {
  name: string;
  seedPosition: number;
  flagEmoji: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

@Injectable()
export class ScheduleRepository {
  constructor(private readonly database: DatabaseService) {}

  async getGroups(): Promise<GroupDto[]> {
    const groups = await this.database.query<{ code: string; name: string }>(
      'SELECT code, name FROM groups ORDER BY code'
    );
    const teams = await this.database.query<{
      name: string;
      group_code: string;
      position: number;
      flag_emoji: string;
    }>('SELECT name, group_code, position, flag_emoji FROM teams ORDER BY group_code, position');
    const finishedMatches = await this.database.query<{
      group_code: string;
      home_team: string;
      away_team: string;
      home_score: number;
      away_score: number;
    }>(
      `SELECT group_code, home_team, away_team, home_score, away_score
       FROM matches
       WHERE status = 'finished'
         AND home_score IS NOT NULL
         AND away_score IS NOT NULL`
    );

    const statsByTeam = new Map<string, TeamStats>();
    for (const team of teams.rows) {
      statsByTeam.set(team.name, {
        name: team.name,
        seedPosition: team.position,
        flagEmoji: team.flag_emoji,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      });
    }

    for (const match of finishedMatches.rows) {
      this.applyResult(statsByTeam, match.home_team, match.home_score, match.away_score);
      this.applyResult(statsByTeam, match.away_team, match.away_score, match.home_score);
    }

    return groups.rows.map((group) => ({
      code: group.code,
      name: group.name,
      teams: teams.rows
        .filter((team) => team.group_code === group.code)
        .map((team) => statsByTeam.get(team.name))
        .filter((team): team is TeamStats => Boolean(team))
        .sort((a, b) => {
          return (
            b.points - a.points ||
            b.goalDifference - a.goalDifference ||
            b.goalsFor - a.goalsFor ||
            a.seedPosition - b.seedPosition
          );
        })
        .map((team, index) => ({
          name: team.name,
          position: index + 1,
          flagEmoji: team.flagEmoji,
          played: team.played,
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          goalsFor: team.goalsFor,
          goalsAgainst: team.goalsAgainst,
          goalDifference: team.goalDifference,
          points: team.points
        }))
    }));
  }

  async getMatches(filters: { group?: string; date?: string }): Promise<MatchDto[]> {
    const params: unknown[] = [];
    const clauses: string[] = [];

    if (filters.group) {
      params.push(filters.group.toUpperCase());
      clauses.push(`group_code = $${params.length}`);
    }

    if (filters.date) {
      params.push(filters.date);
      clauses.push(`kickoff_at::date = $${params.length}::date`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await this.database.query<{
      id: number;
      fifa_match_no: number;
      group_code: string;
      matchday: number;
      home_team: string;
      away_team: string;
      kickoff_at: Date;
      venue: string;
      city: string;
      status: string;
      home_score: number | null;
      away_score: number | null;
    }>(
      `SELECT *
       FROM matches
       ${where}
       ORDER BY kickoff_at, fifa_match_no`,
      params
    );

    return result.rows.map((row) => ({
      id: row.id,
      fifaMatchNo: row.fifa_match_no,
      groupCode: row.group_code,
      matchday: row.matchday,
      homeTeam: row.home_team,
      awayTeam: row.away_team,
      kickoffAt: row.kickoff_at.toISOString(),
      venue: row.venue,
      city: row.city,
      status: row.status,
      homeScore: row.home_score,
      awayScore: row.away_score
    }));
  }

  async updateResult(fifaMatchNo: number, scores: { homeScore: number; awayScore: number }) {
    const result = await this.database.query<{
      id: number;
      fifa_match_no: number;
      group_code: string;
      matchday: number;
      home_team: string;
      away_team: string;
      kickoff_at: Date;
      venue: string;
      city: string;
      status: string;
      home_score: number | null;
      away_score: number | null;
    }>(
      `UPDATE matches
       SET status = 'finished',
           home_score = $2,
           away_score = $3
       WHERE fifa_match_no = $1
       RETURNING *`,
      [fifaMatchNo, scores.homeScore, scores.awayScore]
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      fifaMatchNo: row.fifa_match_no,
      groupCode: row.group_code,
      matchday: row.matchday,
      homeTeam: row.home_team,
      awayTeam: row.away_team,
      kickoffAt: row.kickoff_at.toISOString(),
      venue: row.venue,
      city: row.city,
      status: row.status,
      homeScore: row.home_score,
      awayScore: row.away_score
    };
  }

  async updateResultByTeams(result: {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
  }) {
    const updated = await this.database.query<{ fifa_match_no: number }>(
      `UPDATE matches
       SET status = 'finished',
           home_score = $3,
           away_score = $4
       WHERE lower(home_team) = lower($1)
         AND lower(away_team) = lower($2)
       RETURNING fifa_match_no`,
      [result.homeTeam, result.awayTeam, result.homeScore, result.awayScore]
    );
    const row = updated.rows[0];

    if (!row) {
      return null;
    }

    return this.updateResult(row.fifa_match_no, {
      homeScore: result.homeScore,
      awayScore: result.awayScore
    });
  }

  async getScoreSyncCandidates(now = new Date()): Promise<ScoreSyncCandidate[]> {
    const result = await this.database.query<{
      fifa_match_no: number;
      kickoff_at: Date;
      status: string;
    }>(
      `SELECT fifa_match_no, kickoff_at, status
       FROM matches
       WHERE status <> 'finished'
         AND kickoff_at BETWEEN $1::timestamptz - interval '4 hours'
                            AND $1::timestamptz + interval '30 minutes'
       ORDER BY kickoff_at`,
      [now.toISOString()]
    );

    return result.rows.map((row) => ({
      fifaMatchNo: row.fifa_match_no,
      kickoffAt: row.kickoff_at,
      status: row.status
    }));
  }

  private applyResult(statsByTeam: Map<string, TeamStats>, teamName: string, goalsFor: number, goalsAgainst: number) {
    const stats = statsByTeam.get(teamName);

    if (!stats) {
      return;
    }

    stats.played += 1;
    stats.goalsFor += goalsFor;
    stats.goalsAgainst += goalsAgainst;
    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;

    if (goalsFor > goalsAgainst) {
      stats.wins += 1;
      stats.points += 3;
    } else if (goalsFor === goalsAgainst) {
      stats.draws += 1;
      stats.points += 1;
    } else {
      stats.losses += 1;
    }
  }
}
