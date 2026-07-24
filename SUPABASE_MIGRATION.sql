-- -- SUPABASE_MIGRATION.sql
-- -- Run these statements in your Supabase SQL editor to create the tables used by the admin UI.

-- -- 1) Create a simple portfolio table to store the latest published JSON
-- create table if not exists public.portfolio (
--   id text primary key,
--   data jsonb not null,
--   updated_at timestamptz default now()
-- );

-- -- 2) Create a backups table to store history snapshots
-- create table if not exists public.portfolio_backups (
--   id bigserial primary key,
--   data jsonb not null,
--   created_at timestamptz default now()
-- );

-- -- 3) Example: enable Row Level Security and allow only authenticated users to insert/update
-- -- Enable RLS
-- alter table public.portfolio enable row level security;
-- alter table public.portfolio_backups enable row level security;

-- -- Policy: allow authenticated users to upsert portfolio (adjust to a specific role if needed)
-- create policy "authenticated_upsert" on public.portfolio
--   for insert, update
--   using (auth.role() = 'authenticated')
--   with check (auth.role() = 'authenticated');

-- create policy "authenticated_insert_backups" on public.portfolio_backups
--   for insert
--   using (auth.role() = 'authenticated')
--   with check (auth.role() = 'authenticated');

-- -- Note: For production you may want to further restrict using `auth.uid()` or a specific custom claim.






-- SUPABASE_MIGRATION.sql
-- Run these statements in your Supabase SQL editor

create table if not exists public.portfolio_data (
  id text primary key default 'default',
  data jsonb not null,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.portfolio_backups (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.portfolio_data enable row level security;
alter table public.portfolio_backups enable row level security;

-- Allow public access (anyone can read/write)
create policy "Allow public access" on public.portfolio_data
  for all using (true) with check (true);

create policy "Allow public backups" on public.portfolio_backups
  for all using (true) with check (true);