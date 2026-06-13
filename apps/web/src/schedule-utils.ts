import type { Match } from './types';

export const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';

export const featuredTeams = new Set([
  'Argentina',
  'Brazil',
  'England',
  'France',
  'Germany',
  'Japan',
  'Portugal',
  'Spain'
]);

export function matchesFilter(match: Match, filters: { group: string; date: string; query: string }) {
  const groupOk = filters.group === 'ALL' || match.groupCode === filters.group;
  const dateOk = filters.date === 'ALL' || getDateKeyInVietnam(match.kickoffAt) === filters.date;
  const queryOk = [match.homeTeam, match.awayTeam, match.city, match.venue]
    .join(' ')
    .toLowerCase()
    .includes(filters.query.toLowerCase());

  return groupOk && dateOk && queryOk;
}

export function groupMatchesByDate(matches: Match[]) {
  return matches.reduce<Record<string, Match[]>>((acc, match) => {
    const date = getDateKeyInVietnam(match.kickoffAt);
    acc[date] = acc[date] ?? [];
    acc[date].push(match);
    return acc;
  }, {});
}

export function isFeaturedMatch(match: Pick<Match, 'homeTeam' | 'awayTeam'>) {
  return featuredTeams.has(match.homeTeam) || featuredTeams.has(match.awayTeam);
}

export function getDateKeyInVietnam(value: string | Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: VIETNAM_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}
