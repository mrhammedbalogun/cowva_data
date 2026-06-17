# Cowva Impact — data.cowva.com

Vaccination impact analytics dashboard for investors, government agencies, and
approved partners. Login-gated; access is by Cowva-issued admin accounts only.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (Base UI) components
- Recharts for charts
- Deployed on Vercel → `data.cowva.com`

## Develop

```bash
npm install
npm run dev    # http://localhost:3000
```

Demo login (mock auth, replaced by Django JWT in a later stage):

- Email: `admin@cowva.com`
- Password: `cowva2026`

## Data

Today the dashboard runs on mock data derived from the live Cowva distribution
(see `src/lib/reference.ts`). All data access goes through `src/lib/api.ts`,
which will be pointed at the read-only Django REST analytics API.

Environment variables (set in Vercel when wiring the real backend):

- `NEXT_PUBLIC_USE_MOCK` — `false` to use the live API (defaults to mock)
- `NEXT_PUBLIC_API_BASE_URL` — base URL of the Django analytics API

## Structure

- `src/app/(dashboard)` — authenticated dashboard pages + shell
- `src/app/login` — login page
- `src/app/api/auth` — login/logout route handlers
- `src/proxy.ts` — route protection (redirects unauthenticated users to /login)
- `src/components/filters` — global filter bar + context
- `src/components/dashboard` — KPI cards, charts, tables
- `src/lib` — types, reference data, mock engine, api layer, auth
