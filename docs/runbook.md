# Runbook

## Local Development
- Requires Node 20+
- Enable corepack: `corepack enable`
- Install deps:
  - `pnpm i --frozen-lockfile` if `pnpm-lock.yaml` exists
  - `npm ci` if `package-lock.json` exists
  - otherwise `npm i`
- Lint: `npm run lint` (if present)
- Test: `npm test` (if present)
- Build: `npm run build` (if present)

## CI/CD
- GitHub Actions at `.github/workflows/ci.yml`
- Releases via Release Please on pushes to `main`

## Docker (optional)
- Add a Dockerfile if containerizing; publish on tag via optional workflow

## Env
- Keep secrets in GitHub Secrets; never commit .env with real values
