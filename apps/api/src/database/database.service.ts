import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';
import { seedGroups, seedMatches } from '../seed';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ?? 'postgresql://wc2026:wc2026@localhost:5432/wc2026'
  });

  query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
    return this.pool.query<T>(text, params);
  }

  async initialize() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS groups (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        group_code TEXT NOT NULL REFERENCES groups(code),
        position INTEGER NOT NULL,
        flag_emoji TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        fifa_match_no INTEGER NOT NULL UNIQUE,
        group_code TEXT NOT NULL REFERENCES groups(code),
        matchday INTEGER NOT NULL,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        kickoff_at TIMESTAMPTZ NOT NULL,
        venue TEXT NOT NULL,
        city TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'scheduled',
        home_score INTEGER,
        away_score INTEGER
      );
    `);

    await this.seed();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  private async seed() {
    for (const group of seedGroups) {
      await this.query(
        `INSERT INTO groups (code, name)
         VALUES ($1, $2)
         ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name`,
        [group.code, group.name]
      );

      for (const team of group.teams) {
        await this.query(
          `INSERT INTO teams (name, group_code, position, flag_emoji)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (name) DO UPDATE
           SET group_code = EXCLUDED.group_code,
               position = EXCLUDED.position,
               flag_emoji = EXCLUDED.flag_emoji`,
          [team.name, group.code, team.position, team.flagEmoji]
        );
      }
    }

    for (const match of seedMatches) {
      await this.query(
        `INSERT INTO matches (
          fifa_match_no, group_code, matchday, home_team, away_team,
          kickoff_at, venue, city, status, home_score, away_score
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (fifa_match_no) DO UPDATE
        SET group_code = EXCLUDED.group_code,
            matchday = EXCLUDED.matchday,
            home_team = EXCLUDED.home_team,
            away_team = EXCLUDED.away_team,
            kickoff_at = EXCLUDED.kickoff_at,
            venue = EXCLUDED.venue,
            city = EXCLUDED.city,
            status = EXCLUDED.status,
            home_score = EXCLUDED.home_score,
            away_score = EXCLUDED.away_score`,
        [
          match.fifaMatchNo,
          match.groupCode,
          match.matchday,
          match.homeTeam,
          match.awayTeam,
          match.kickoffAt,
          match.venue,
          match.city,
          match.status,
          match.homeScore ?? null,
          match.awayScore ?? null
        ]
      );
    }
  }
}
