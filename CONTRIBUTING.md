# Contributing

We use Conventional Commits (feat, fix, chore, ci, docs, refactor, perf, test).

## Setup
- Node 20 (use `corepack enable` for pnpm/yarn)
- Prefer `pnpm` if `pnpm-lock.yaml` exists; otherwise keep existing PM.

## Development
- Lint: `npm run lint` (if present)
- Test: `npm test` (if present)
- Build: `npm run build` (if present)

## Pull Requests
- Branch from latest `main`.
- One logical change per PR.
- Include a Test Plan and Rollback section.
