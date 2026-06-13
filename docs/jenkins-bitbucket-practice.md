# Jenkins + Bitbucket Practice

## Local preparation

```powershell
docker compose up -d postgres
npm ci
npm run lint
npm test
npm run build
```

## Bitbucket setup

1. Create a Bitbucket repository.
2. Push this project to the repository.
3. Create branches like `feature/add-knockout-filter`.
4. Open a Pull Request into `main`.

## Jenkins setup

1. Install Jenkins plugins:
   - Git
   - Bitbucket Branch Source
   - Pipeline
   - NodeJS, if your Jenkins agent does not already have Node installed
2. Create a Multibranch Pipeline job.
3. Add Bitbucket credentials.
4. Point the job to the Bitbucket repo.
5. Add a Bitbucket webhook:

```text
https://<jenkins-host>/bitbucket-scmsource-hook/notify
```

## Pipeline behavior

The `Jenkinsfile` runs:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`

This provides a realistic CI flow for the project:

- deterministic install with lockfile
- parallel quality gates
- build artifact archiving
- PR feedback from Bitbucket to Jenkins
- next possible step: run PostgreSQL as a Jenkins service and add API integration tests

## Interview talking points

- Security automation: `npm audit --omit=dev` can become an extra Jenkins stage.
- Build police: failed lint/test/build blocks merge.
- Pipeline investigation: Jenkins console output shows the exact failing workspace/package.
- Patch workflow: create branch, update dependencies, run quality gate, open PR.
- Scheduled automation: `ScoreSyncService` is a NestJS cron job that pulls provider scores every 1 minute.
