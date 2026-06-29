# ReviewDibo

A full-stack product review platform — browse products, read reviews, and submit your own.

**Stack:** FastAPI (async) · SQLAlchemy 2.0 · Alembic · PostgreSQL 16 · Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui

---

## Live links

| | URL |
|---|---|
| Frontend | _Vercel URL (see deployment section)_ |
| Backend API | _Render URL (see deployment section)_ |
| Swagger / OpenAPI | `<backend-url>/docs` |

---

## Local setup

### Prerequisites

| Tool | Version |
|------|---------|
| Docker & Docker Compose | v24+ |
| Python | 3.12+ |
| [uv](https://github.com/astral-sh/uv) | latest |
| Node.js | 20+ |
| npm | any |

### Option A — full stack in Docker

```bash
# 1. Clone and enter the repo
git clone <repo-url> && cd product-review-platform

# 2. Start Postgres + backend
docker compose up --build -d

# 3. Run migrations and seed data
docker compose exec backend uv run alembic upgrade head
docker compose exec backend uv run python scripts/seed.py

# 4. Start the frontend
cd frontend
cp .env.example .env.local          # default: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm install
npm run dev
```

### Option B — backend locally (faster iteration)

```bash
# Terminal 1 — Postgres only
docker compose up db -d

# Terminal 2 — backend
cd backend
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run python scripts/seed.py
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 3 — frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger / OpenAPI | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |

---

## Environment variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql+asyncpg://reviewdibo:reviewdibo@localhost:5432/reviewdibo
JWT_SECRET=change-me-to-a-long-random-secret
JWT_EXPIRE_MINUTES=60
CORS_ORIGINS=["http://localhost:3000"]
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | asyncpg connection string |
| `JWT_SECRET` | Secret key for JWT signing — use a long random string in production |
| `JWT_EXPIRE_MINUTES` | Token lifetime in minutes |
| `CORS_ORIGINS` | JSON array of allowed origins |

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Development commands

```bash
# Backend — lint + typecheck
cd backend && uv run ruff check . && uv run mypy .

# Backend — run tests
cd backend && uv run pytest

# Frontend — lint + typecheck
cd frontend && npm run lint && npm run typecheck

# New migration (after model change)
cd backend && uv run alembic revision --autogenerate -m "describe change"
uv run alembic upgrade head
```

---

## Deployment

### 1 — Database: Neon (free Postgres)

1. Sign up at [neon.tech](https://neon.tech), create a project.
2. Copy the **connection string** — it looks like:
   ```
   postgresql+asyncpg://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Set it as `DATABASE_URL` in the backend's env vars on Render.

### 2 — Backend: Render

1. Create a new **Web Service** pointing to the repo root.
2. **Build command:** `cd backend && pip install uv && uv sync`
3. **Start command:** `cd backend && uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment variables:**

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Neon connection string |
   | `JWT_SECRET` | A long random string |
   | `JWT_EXPIRE_MINUTES` | `60` |
   | `CORS_ORIGINS` | `["https://your-vercel-app.vercel.app"]` |

5. After first deploy, run the seed script from the Render **Shell** tab:
   ```bash
   uv run python scripts/seed.py
   ```

> **Cold starts:** Free-tier Render services sleep after inactivity. The `/health` endpoint is used for uptime pings to keep the service warm.

### 3 — Frontend: Vercel

1. Import the repo in [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. **Environment variable:**

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://your-render-app.onrender.com` |

4. Deploy — Vercel auto-detects Next.js.

---

## Features shipped

| Feature | Status |
|---------|--------|
| Product list with search + rating filter | ✅ |
| Product detail with review list | ✅ |
| Submit review (auth required) | ✅ |
| JWT register / login | ✅ |
| Responsive UI (shadcn/ui + Tailwind) | ✅ |
| Loading skeletons + error boundary | ✅ |
| Partial star rendering (float rating) | ✅ |
| Admin: delete any review | ✅ |

## Out of scope (future work)

Image upload to S3 · Review helpfulness voting · Pagination · Rate limiting · Email verification · Role management UI · Full test coverage · CI/CD pipeline
