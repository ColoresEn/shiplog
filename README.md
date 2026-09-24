# shiplog

Weekly log of progress across projects. Next.js (App Router) + Supabase (Postgres, Auth, RLS).

- Public: weekly feed (`/`), a page per ISO week (`/week/2026-W13`), project pages (`/projects/[slug]`), RSS (`/feed.xml`).
- Private: `/dashboard` to create projects and write/publish weekly entries in Markdown.
- Auth: Supabase magic link; only the signed-in owner can write (enforced by row level security).

## Setup

1. Create a Supabase project, then copy the API URL and anon key:

   ```bash
   cp .env.example .env.local
   ```

2. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (or
   `supabase db push` with the CLI).

3. In Supabase → Authentication → URL Configuration, set the site URL and add
   `http://localhost:3000/auth/callback` (plus the production equivalent) as a
   redirect URL.

4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

Sign in at `/login` with your email; the first sign-in creates the owner account.

## Data model

| Table      | Purpose                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `projects` | One row per project (`slug`, `name`, `description`, `repo_url`).        |
| `entries`  | One weekly note (`week_start` = Monday, Markdown `body`, `published`).  |

RLS: everyone can read projects and published entries; only `owner_id` can
insert, update, delete, or read drafts.

## Deploy

Deploy to Vercel and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
and `NEXT_PUBLIC_SITE_URL` as environment variables.
