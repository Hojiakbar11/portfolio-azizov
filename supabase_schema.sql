-- Create projects table (Updated)
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  long_description text,
  image_url text,
  github_url text,
  live_url text,
  is_private boolean default false,
  password text,
  technologies text[] default '{}',
  category text default 'Web Development'
);

-- Create profile table
create table if not exists profile (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  role text,
  short_bio text,
  about_me_long text,
  email text,
  phone text,
  location text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create education table
create table if not exists education (
  id uuid default gen_random_uuid() primary key,
  degree text not null,
  school text not null,
  date_range text,
  description text,
  order_index int default 0
);

-- Create experience table
create table if not exists experience (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  date_range text,
  description text,
  order_index int default 0
);

-- Create skills table
create table if not exists skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text, -- e.g., 'Frontend', 'Security', 'Tools'
  icon_name text -- Lucide icon name
);

-- Create taplinks table
create table if not exists taplinks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  icon_name text,
  order_index int default 0
);

-- Create messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false
);

-- Set up Row Level Security (RLS)
alter table projects enable row level security;
alter table profile enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table skills enable row level security;
alter table taplinks enable row level security;
alter table messages enable row level security;

-- Policies for projects
create policy "Public projects are viewable by everyone." on projects for select using ( true );
create policy "Authenticated users can manage all projects" on projects for all using ( auth.role() = 'authenticated' );

-- Policies for profile (Anyone can read, only admin can update)
create policy "Public profile is viewable by everyone." on profile for select using ( true );
create policy "Authenticated users can manage profile" on profile for all using ( auth.role() = 'authenticated' );

-- Policies for education (Anyone can read, only admin can update)
create policy "Public education is viewable by everyone." on education for select using ( true );
create policy "Authenticated users can manage education" on education for all using ( auth.role() = 'authenticated' );

-- Policies for experience (Anyone can read, only admin can update)
create policy "Public experience is viewable by everyone." on experience for select using ( true );
create policy "Authenticated users can manage experience" on experience for all using ( auth.role() = 'authenticated' );

-- Policies for skills (Anyone can read, only admin can update)
create policy "Public skills are viewable by everyone." on skills for select using ( true );
create policy "Authenticated users can manage skills" on skills for all using ( auth.role() = 'authenticated' );

-- Policies for taplinks (Anyone can read, only admin can update)
create policy "Public taplinks are viewable by everyone." on taplinks for select using ( true );
create policy "Authenticated users can manage taplinks" on taplinks for all using ( auth.role() = 'authenticated' );

-- Policies for messages (Only admin can read/delete, anyone can insert)
create policy "Anyone can send a message" on messages for insert with check ( true );
create policy "Authenticated users can manage messages" on messages for all using ( auth.role() = 'authenticated' );

-- Storage Buckets Configuration (Run manually in SQL Editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', true) ON CONFLICT (id) DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Simplified)
-- CREATE POLICY "Public Access Project Images" ON storage.objects FOR SELECT USING ( bucket_id = 'project-images' );
-- CREATE POLICY "Authenticated users can manage Project Images" ON storage.objects FOR ALL USING ( auth.role() = 'authenticated' );
-- Create terminal_commands table
create table if not exists terminal_commands (
  id uuid default gen_random_uuid() primary key,
  command_name text not null unique,
  response_text text not null,
  category text default 'general'
);

alter table terminal_commands enable row level security;

create policy "Public terminal commands are viewable by everyone." on terminal_commands for select using ( true );
create policy "Authenticated users can manage terminal commands" on terminal_commands for all using ( auth.role() = 'authenticated' );

-- Insert default commands
insert into terminal_commands (command_name, response_text, category) values 
('about', 'I am a passionate Full Stack Developer focused on building high-end, secure web applications.', 'general'),
('skills', 'My core stack includes: Next.js, TypeScript, Tailwind CSS, Supabase, and Framer Motion.', 'general'),
('contact', 'You can reach me via the contact form below or email me at john@example.com', 'general')
on conflict (command_name) do nothing;
