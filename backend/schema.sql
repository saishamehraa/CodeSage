-- backend/schema.sql
create extension if not exists "uuid-ossp";

-- Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  repository text not null,
  last_scan timestamp with time zone default now(),
  status text check (status in ('pass', 'warn', 'block')),
  reliability_score integer default 0,
  security_score integer default 0,
  maintainability_score integer default 0,
  total_issues integer default 0,
  critical_issues integer default 0,
  files_scanned integer default 0,
  created_at timestamp with time zone default now()
);

-- Issues Table
create table issues (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  file_path text not null,
  line_number integer not null,
  severity text check (severity in ('critical', 'high', 'medium', 'low')),
  issue_type text not null,
  message text not null,
  description text not null,
  cve text,
  fix_suggestion text,
  created_at timestamp with time zone default now()
);

-- Enable Realtime for the WebSocket UI
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table issues;

-- Enable RLS and create public policies (for hackathon ease of use)
alter table projects enable row level security;
alter table issues enable row level security;

create policy "Allow public access to projects" on projects for all using (true);
create policy "Allow public access to issues" on issues for all using (true);