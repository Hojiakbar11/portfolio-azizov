-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  github_url text,
  live_url text,
  is_private boolean default false,
  technologies text[] default '{}'
);

-- Set up Row Level Security (RLS)
alter table projects enable row level security;

-- Create policy to allow anyone to read public projects
create policy "Public projects are viewable by everyone."
  on projects for select
  using ( not is_private );

-- Create policy to allow authenticated users to do everything
create policy "Authenticated users can manage all projects"
  on projects for all
  using ( auth.role() = 'authenticated' );

-- NOTE: You must also create a storage bucket named 'cvs' in the Supabase Dashboard.
-- 1. Go to Storage -> New Bucket
-- 2. Name it 'cvs'
-- 3. Make it 'Public' so your CV can be downloaded without authentication.
