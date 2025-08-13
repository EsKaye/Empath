# Cross-Repo Integration Plan

## Message Envelope
```json
{ "service": "<name>", "intent": "<action>", "traceId": "${ISO_TIMESTAMP}/${RANDOM}", "payload": { "..." } }
```

## Env Contract (prefix `MKW_`)
- `MKW_ENV` (dev|staging|prod)
- `MKW_ROUTER_URL`
- `MKW_NEXUS_URL`
- `MKW_TOKEN` (signed service token; never commit)

## Shared Packages
- TS: `mkw-shared` (types + client)
- Py: `mkw_shared` (dataclasses + client)

## Rollout Steps
1. Ship shared package v0.1.0
2. Update services to consume behind a feature flag
3. E2E test path across router ⇄ nexus ⇄ target service
