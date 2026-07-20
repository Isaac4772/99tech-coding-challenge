## Prerequisites

- [Bun](https://bun.sh) (v1.3+)
- Install dependencies once after cloning:

  ```sh
  bun install
  ```

## Problem 4

Run the solution:

```sh
bun run problem4
```

Run the tests:

```sh
bun run test:problem4
```

## Problem 5 — Task CRUD API

An Express + Prisma (PostgreSQL) CRUD service. See
[`src/problem5/readme.md`](./src/problem5/readme.md) for endpoint documentation.

### 1. Configure environment

```sh
cp .env.example .env
```

`.env` holds `DATABASE_URL` (used by the app and by migrations) and
`SHADOW_DATABASE_URL` (used by `prisma migrate dev`). The defaults match the
local Prisma Postgres dev server below.

### 2. Start a local database

Spin up the local Prisma Postgres dev server (listens on ports 51214 / 51215,
matching `.env.example`):

```sh
bun --bun run prisma dev
```

Leave this running in its own terminal. If you use your own Postgres instead,
just point `DATABASE_URL` / `SHADOW_DATABASE_URL` at it.

### 3. Run the API

```sh
bun run problem5        # start once
bun run problem5:dev    # start with watch/reload
```

Either command first applies pending migrations and regenerates the Prisma
client, then starts the server on `http://localhost:8000` (override with `PORT`):

- `GET /healthz` — health check
- `GET /docs` — Swagger UI
- `GET /openapi.json` — OpenAPI spec
- `/tasks` — Task CRUD endpoints

### 4. Run the tests

```sh
bun run test:problem5
```

Tests run against an isolated `test` schema; migrations are applied
automatically to it via the `pretest:problem5` hook before the suite runs.
