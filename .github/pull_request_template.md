## Summary
Standard CI/CD bootstrap and repo hardening.

## Changes
- Add CI workflows (lint/test/build)
- Add minimal docs & repo meta
- Add Renovate config and badges

## Test Plan
- CI green on this PR
- Local build runs with documented command

## Rollback
- Revert this PR; no data migrations

## Deviations
- CI jobs are conditional and non-blocking to avoid runtime changes.
