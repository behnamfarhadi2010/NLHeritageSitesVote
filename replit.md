# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- `nl-historic-rank` — React + Vite single-page app at `/` for head-to-head voting on the National Historic Sites of Newfoundland and Labrador. Uses chess-style ELO scoring.
- `api-server` — Express 5 API serving `/api/*`. Routes: `sites`, `matchup`, `votes`, `stats`.
- `mockup-sandbox` — Canvas mockup sandbox.

## Data model

- `sites` — name, designated year, location, summary, image URL, ELO `score` (default 1500), `previousRank`, `matchesPlayed`, `wins`.
- `votes` — `winnerId`, `loserId`, `winnerScoreBefore`/`After`, `loserScoreBefore`/`After`, `eloDelta`, `createdAt`.

ELO is computed with K=32 (`artifacts/api-server/src/lib/elo.ts`). After each vote both sites get their new score and a `previousRank` snapshot so the rankings list can show movement.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/scripts run seed-sites` — seed the historic sites table (idempotent: skips if rows exist)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
