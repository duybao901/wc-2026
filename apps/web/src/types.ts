export interface Team {
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

export interface Group {
  code: string;
  name: string;
  teams: Team[];
}

export interface Match {
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
