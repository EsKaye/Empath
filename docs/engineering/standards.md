# Engineering Standards

- Node 20 for JS/TS; Python 3.11 for Python
- Prefer pnpm when a pnpm lockfile exists; otherwise keep repo PM
- CI: lint → test → build; jobs are conditional and non-blocking initially
- No direct pushes to `main`; use branches + PRs
- Never commit secrets; use GitHub Secrets
- Add README badges for CI and Release
