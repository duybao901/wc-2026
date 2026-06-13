import { describe, expect, it } from 'vitest';
import { getDateKeyInVietnam, groupMatchesByDate, isFeaturedMatch, matchesFilter } from './schedule-utils';
import type { Match } from './types';

const match: Match = {
  id: 1,
  fifaMatchNo: 1,
  groupCode: 'A',
  matchday: 1,
  homeTeam: 'Mexico',
  awayTeam: 'South Africa',
  kickoffAt: '2026-06-11T19:00:00.000Z',
  venue: 'Estadio Azteca',
  city: 'Mexico City',
  status: 'finished',
  homeScore: 2,
  awayScore: 0
};

describe('schedule utilities', () => {
  it('filters by group, date and text query', () => {
    expect(matchesFilter(match, { group: 'A', date: '2026-06-12', query: 'azteca' })).toBe(true);
    expect(matchesFilter(match, { group: 'B', date: '2026-06-12', query: 'azteca' })).toBe(false);
  });

  it('groups matches by Vietnam kickoff date', () => {
    const grouped = groupMatchesByDate([match]);

    expect(grouped['2026-06-12']).toHaveLength(1);
  });

  it('creates Vietnam date keys from UTC kickoffs', () => {
    expect(getDateKeyInVietnam('2026-06-11T19:00:00.000Z')).toBe('2026-06-12');
  });

  it('detects featured matches for selected national teams', () => {
    expect(isFeaturedMatch({ homeTeam: 'Brazil', awayTeam: 'Morocco' })).toBe(true);
    expect(isFeaturedMatch({ homeTeam: 'Mexico', awayTeam: 'South Africa' })).toBe(false);
  });
});
