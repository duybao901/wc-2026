import { describe, expect, it } from '@jest/globals';
import { getMatchSyncPhase, normalizeProviderResults } from './score-sync.service';

describe('score sync normalizer', () => {
  it('normalizes the app provider format', () => {
    const results = normalizeProviderResults({
      matches: [
        {
          fifaMatchNo: 3,
          homeScore: 2,
          awayScore: 1,
          status: 'finished'
        }
      ]
    });

    expect(results).toEqual([
      {
        fifaMatchNo: 3,
        homeScore: 2,
        awayScore: 1,
        status: 'finished'
      }
    ]);
  });

  it('normalizes a common football provider shape', () => {
    const results = normalizeProviderResults({
      response: [
        {
          matchNo: '7',
          fixture: {
            status: {
              short: 'FT'
            }
          },
          goals: {
            home: 3,
            away: 2
          }
        }
      ]
    });

    expect(results[0]).toEqual({
      fifaMatchNo: 7,
      homeScore: 3,
      awayScore: 2,
      status: 'finished'
    });
  });

  it('normalizes football-data.org style finished matches', () => {
    const results = normalizeProviderResults({
      matches: [
        {
          status: 'FINISHED',
          homeTeam: { name: 'Canada' },
          awayTeam: { name: 'Bosnia-Herzegovina' },
          score: {
            fullTime: {
              home: 1,
              away: 1
            }
          }
        }
      ]
    });

    expect(results[0]).toEqual({
      homeTeam: 'Canada',
      awayTeam: 'Bosnia-Herzegovina',
      homeScore: 1,
      awayScore: 1,
      status: 'finished'
    });
  });

  it('skips live or unmapped rows', () => {
    const results = normalizeProviderResults({
      matches: [
        { fifaMatchNo: 4, homeScore: 1, awayScore: 1, status: 'live' },
        { homeScore: 1, awayScore: 0, status: 'finished' }
      ]
    });

    expect(results).toHaveLength(0);
  });

  it('calculates score sync windows from kickoff time', () => {
    const kickoff = new Date('2026-06-13T12:00:00.000Z');

    expect(getMatchSyncPhase(kickoff, new Date('2026-06-13T11:40:00.000Z'))).toBe('pre-match');
    expect(getMatchSyncPhase(kickoff, new Date('2026-06-13T12:45:00.000Z'))).toBe('live');
    expect(getMatchSyncPhase(kickoff, new Date('2026-06-13T13:45:00.000Z'))).toBe('final-window');
    expect(getMatchSyncPhase(kickoff, new Date('2026-06-13T14:30:00.000Z'))).toBe('post-match');
    expect(getMatchSyncPhase(kickoff, new Date('2026-06-13T17:00:00.000Z'))).toBe('delayed-final');
    expect(getMatchSyncPhase(kickoff, new Date('2026-06-15T01:00:00.000Z'))).toBeNull();
  });
});
