-- Create the instruments table
create table if not exists instruments (
  id bigint primary key generated always as identity,
  name text not null
);

-- Insert some sample data into the table
insert into instruments (name)
values
  ('violin'),
  ('viola'),
  ('cello');

-- Enable Row Level Security
alter table instruments enable row level security;

-- Create a policy that allows anyone to read the instruments table
create policy "public can read instruments"
  on public.instruments
  for select
  to anon
  using (true);

-- Create a policy that allows authenticated users (via Clerk) to read as well
-- (Supabase 'anon' role is distinct from 'authenticated', so we might need this if the user is logged in)
create policy "authenticated can read instruments"
  on public.instruments
  for select
  to authenticated
  using (true);
