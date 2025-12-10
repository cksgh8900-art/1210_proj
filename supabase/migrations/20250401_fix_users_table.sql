-- Create users table if it doesn't exist
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text not null unique,
  name text not null,
  created_at timestamp with time zone default now() not null
);

-- Grant permissions
grant all on table public.users to anon;
grant all on table public.users to authenticated;
grant all on table public.users to service_role;

-- Enable RLS (optional, but good practice)
alter table public.users enable row level security;

-- Policy: Users can read their own data
create policy "Users can read own data"
  on public.users
  for select
  using ( clerk_id = (select auth.jwt() ->> 'sub') );

-- Policy: Service role can do anything
create policy "Service role can do anything"
  on public.users
  using ( true )
  with check ( true );
