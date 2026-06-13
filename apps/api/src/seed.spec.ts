import { seedGroups, seedMatches } from './seed';

describe('world cup seed data', () => {
  it('contains 12 groups and 48 teams', () => {
    expect(seedGroups).toHaveLength(12);
    expect(seedGroups.flatMap((group) => group.teams)).toHaveLength(48);
  });

  it('contains 72 group-stage matches with unique FIFA match numbers', () => {
    const matchNumbers = new Set(seedMatches.map((match) => match.fifaMatchNo));

    expect(seedMatches).toHaveLength(72);
    expect(matchNumbers.size).toBe(72);
  });

  it('does not reference teams outside their group', () => {
    const teamsByGroup = new Map(
      seedGroups.map((group) => [group.code, new Set(group.teams.map((team) => team.name))])
    );

    for (const match of seedMatches) {
      const teams = teamsByGroup.get(match.groupCode);

      expect(teams?.has(match.homeTeam)).toBe(true);
      expect(teams?.has(match.awayTeam)).toBe(true);
    }
  });
});
