# High-Volume Users Dashboard (Monorepo)

A small monorepo demo built to prove one thing: the UI stays **smooth** even with a **very large dataset** (hundreds of thousands up to 1M users), while still supporting real “product” features like server-side filtering/sorting, pagination, and optimistic edits.

## What we built (in plain English)

- **Generated a huge user dataset** (realistic fields, not just `name1`, `name2`):
  - `id` (public UUID string), `firstName`, `lastName`, `email`, `phoneNumber`, `age`, `gender`, `status`
- **Backend API** (Fastify + Prisma + Postgres):
  - Returns users using **server-side filtering, sorting, and pagination**
  - Exposes a lightweight **count endpoint** to show `totalRecords`
  - Supports **editing a user** with optimistic UI + simulated random failures
- **Frontend UI** (React + Vite):
  - Two tables to compare approaches:
    - **TanStack Table + TanStack Virtual** (custom virtualized table, infinite/cursor style if needed)
    - **MUI DataGrid** (built-in virtualization, server-side pagination/sorting)
  - Includes **debounced search** (so typing doesn’t spam the API)
  - Includes an **expensive computed column** to demonstrate memoization/caching techniques

---

## Dataset generation (how users were created)

Users were seeded into Postgres using a script that inserts data in batches (to avoid memory spikes and keep inserts stable).
Fields are realistic (names, emails, phone numbers, age range, gender, status) and each record has a **unique public ID** (UUID) for the UI.

Why this matters:

- A table can look fast with 10k rows.
- It gets interesting when you push 50k / 500k / 1M and the UI still feels “native”.

---

## Backend overview

Tech:

- **Fastify** for a small/fast HTTP server
- **Prisma** for DB access
- **Postgres** (hosted; not local-only)
- **CORS enabled** for local + deployed frontend

### Key endpoints

- `GET /health`
  Simple health check.

- `GET /api/users`
  Returns a page of users with:
  - `limit`
  - `search`
  - `gender`
  - `status`
  - `sortBy`
  - `sortDir`

- `GET /api/users/page` (for MUI DataGrid)
  Server-side page pagination:
  - `page` (0-based)
  - `pageSize`
  - same filters/sorting as above

- `GET /api/users/count`
  Returns `{ totalRecords }`, but we only call it when:
  - search changes
  - filters change
    (We avoid calling it on every pagination click to keep the API fast.)

- `PATCH /api/users/:id`
  Updates a user, with a **random failure simulation** (rollback testing):
  - ~25% of updates fail intentionally

---

## Frontend overview

Tech:

- React + Vite
- TanStack Query
- TanStack Table (+ TanStack Virtual for virtualization)
- MUI DataGrid (virtualized grid)

### Performance strategy (why it stays smooth)

- **Virtualization**: only renders the visible rows, not the entire dataset.
- **Server-side pagination/filter/sort**:
  - The browser never downloads “everything”.
  - The server does the heavy lifting.
- **Debounced search**:
  - 300–500ms delay before firing a request.
  - Prevents request spam while typing.
- **Expensive computed column (demo purpose)**:
  - We compute a “score” per row using a deliberately heavy function.
  - We cache the result by `id` so scrolling doesn’t recompute the same score again.

### What is “Computed Score”?

The API does **not** send `score`.
It’s computed on the client to demonstrate:

- CPU-heavy per-row work
- caching/memoization so the UI still scrolls smoothly

---

## Project structure (high level)

- `apps/api` — backend (Fastify + Prisma)
- `apps/web` — frontend (React + Vite)

---

## Running locally

### 1) Install deps (root)

```bash
pnpm install
```
