# WC2026 App

World Cup 2026 match center built with a NestJS API, PostgreSQL, React, and quota-aware score synchronization.

## Stack

- Backend: NestJS + `pg`
- Frontend: React + Vite
- Database: PostgreSQL 16 via Docker Compose
- CI/CD: Jenkinsfile and Bitbucket-friendly pipeline flow

## Local Setup

```powershell
docker compose up -d postgres
npm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

Add your score provider token to `apps/api/.env`:

```env
SCORE_SYNC_API_KEY=your-api-key
```

Run the apps:

```powershell
npm run dev -w @wc2026/api
npm run dev -w @wc2026/web
```

- API: `http://localhost:3000`
- Web: `http://localhost:5173`
- Health check: `http://localhost:3000/health`

The API creates the database schema and seeds the group-stage schedule on startup.

## Environment Files

Environment variables are split by app:

- `apps/api/.env`: backend secrets, database URL, score sync settings
- `apps/web/.env`: frontend public config only

Do not put API tokens in `apps/web/.env`. Vite exposes `VITE_*` variables to the browser bundle.

## API Endpoints

- `GET /health`
- `GET /groups`
- `GET /matches`
- `GET /matches?group=A`
- `GET /matches?date=2026-06-18`
- `PATCH /matches/:fifaMatchNo/result`
- `GET /score-sync/status`
- `POST /score-sync/run`

Manual score update example:

```powershell
curl -Method PATCH http://localhost:3000/matches/3/result `
  -ContentType "application/json" `
  -Body '{"homeScore":2,"awayScore":1}'
```

After a result is updated, the group table is recalculated from finished matches.

## Score Sync

The backend includes `ScoreSyncService`, which checks every minute but does not call the external provider continuously. It only calls the provider when a match is near kickoff, live, near full-time, or recently finished.

Default provider config:

```env
SCORE_SYNC_ENABLED=true
SCORE_SYNC_URL=https://api.football-data.org/v4/competitions/WC/matches?season=2026
SCORE_SYNC_API_KEY=your-api-key
SCORE_SYNC_AUTH_HEADER=X-Auth-Token
SCORE_SYNC_DAILY_LIMIT=95
SCORE_SYNC_PER_MINUTE_LIMIT=10
```

Default quota-aware sync behavior:

- 30 minutes before kickoff: sync at most every 30 minutes.
- During the match: sync at most every 10 minutes.
- 100 to 135 minutes after kickoff: sync at most every 3 minutes to catch full-time scores sooner.
- 135 minutes to 4 hours after kickoff: sync at most every 15 minutes to catch delayed scores.
- Daily limit defaults to 95 requests to stay below a 100 requests/day free-tier quota.
- Per-minute limit defaults to 10 calls/minute.

Manual sync:

```powershell
curl -Method POST http://localhost:3000/score-sync/run
curl http://localhost:3000/score-sync/status
```

The frontend polls `GET /groups` and `GET /matches` every 5 seconds, so open pages update automatically after the database changes.

## Provider Payload

The app can normalize provider rows that include either a FIFA match number or team names.

Minimal supported payload shape:

```json
{
  "matches": [
    {
      "fifaMatchNo": 3,
      "homeScore": 2,
      "awayScore": 1,
      "status": "finished"
    }
  ]
}
```

Sample payload: `docs/mock-score-provider.json`.

If a provider uses its own fixture IDs, add a mapping layer from `provider_fixture_id` to `fifa_match_no`.

## Data Providers

Reasonable free/public options:

- `football-data.org`: World Cup support in the free tier, delayed scores, `X-Auth-Token` header.
- `API-Football`: live score coverage with a free tier and request limits, usually using `x-apisports-key`.

Avoid scraping FIFA/FotMob pages directly. It is fragile, may violate terms of service, and can break whenever page markup changes.

## Bitbucket/Jenkins Flow

1. Create a Bitbucket repository and push the code.
2. Create a Jenkins Multibranch Pipeline job.
3. Configure the Bitbucket webhook: `https://<jenkins-host>/bitbucket-scmsource-hook/notify`.
4. Create a feature branch and open a Pull Request.
5. Jenkins runs `npm ci`, `lint`, `test`, and `build`.

More details: `docs/jenkins-bitbucket-practice.md`.

## Seed Data

The group-stage schedule seed is based on the current WC2026 schedule as of 2026-06-13. Because this is a live event, a production app should rely on a provider sync/import job instead of treating seed data as authoritative.
