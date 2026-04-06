# Auto Dealership

Internal dealership management platform for inventory, enquiries, employees, reporting and personal sales performance.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- React Hook Form + Zod
- TanStack Table
- Recharts

## Why PostgreSQL instead of SQLite

The original brief preferred Prisma + SQLite, but this repository is prepared to deploy on Vercel. Durable writes on Vercel are a much better fit with PostgreSQL than SQLite in a serverless environment, so the project uses PostgreSQL while keeping the rest of the requested architecture intact.

## Demo accounts

- `admin@dealer.com` / `password`
- `sales@dealer.com` / `password`

## Local setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Deploying to Vercel

1. Provision Postgres (Neon, Supabase, Railway, Vercel Postgres, etc).
2. Add `DATABASE_URL` in Vercel project settings.
3. Run `npm run db:push` and `npm run db:seed` once against the target database.
4. Deploy normally.
