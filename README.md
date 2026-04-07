# Auto Dealership

Automotive dealership management platform for internal daily operations.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- React Hook Form + Zod
- TanStack Table
- Recharts

## Why PostgreSQL instead of SQLite

The brief originally preferred Prisma + SQLite, but this repository is intended to be Vercel friendly. Durable writes on Vercel are a much better fit with PostgreSQL than SQLite, so the project uses PostgreSQL while preserving the rest of the requested architecture.

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

## Deploy to Vercel

1. Create a PostgreSQL database on Neon, Supabase, Railway, or Vercel Postgres.
2. Add `DATABASE_URL` in Vercel project settings.
3. Run `npm run db:push` against the target database.
4. Run `npm run db:seed` once.
5. Deploy.

## Product notes

This app keeps the interface restrained and operational:
- one admin workspace
- one sales workspace
- realistic data model
- working role checks
- working enquiry assignment and status updates
- working sale logging
- working interaction logging
- vehicle create, edit, delete, and sold state handling
