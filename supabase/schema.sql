-- users
create table public.users (
  id uuid references auth.users primary key,
  created_at timestamp default now(),
  email text
);

-- submissions
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  user_id uuid references users(id),
  model_name text not null,
  endpoint_url text not null,
  auth_type text not null,
  auth_value text,
  input_field text not null,
  output_field text not null,
  turn_type text not null,
  capability_tier text not null,
  is_public boolean default true,
  display_name text,
  status text default 'pending',
  composite_score float
);

-- assessment_runs
create table public.assessment_runs (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id),
  created_at timestamp default now(),
  status text default 'pending',
  current_category text,
  progress_percent integer default 0
);

-- category_scores
create table public.category_scores (
  id uuid primary key default gen_random_uuid(),
  assessment_run_id uuid references assessment_runs(id),
  category_slug text not null,
  score float,
  weight float,
  status text,
  owasp_tag text,
  owasp_status text
);

-- test_results
create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  assessment_run_id uuid references assessment_runs(id),
  test_id text not null,
  category_slug text not null,
  run_number integer not null,
  prompt_sent text not null,
  response_received text not null,
  passed boolean not null,
  severity text not null,
  partial_success boolean default false,
  raw_score float,
  created_at timestamp default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.submissions enable row level security;
alter table public.assessment_runs enable row level security;
alter table public.category_scores enable row level security;
alter table public.test_results enable row level security;

create policy "users can read own data" on public.users for select using (auth.uid() = id);
create policy "users can read own submissions" on public.submissions for select using (auth.uid() = user_id);
create policy "users can insert own submissions" on public.submissions for insert with check (auth.uid() = user_id);
create policy "users can update own submissions" on public.submissions for update using (auth.uid() = user_id);
create policy "users can read own runs" on public.assessment_runs for select using (
  submission_id in (select id from submissions where user_id = auth.uid())
);
create policy "public runs readable" on public.assessment_runs for select using (
  submission_id in (select id from submissions where is_public = true)
);
create policy "users can read own scores" on public.category_scores for select using (
  assessment_run_id in (
    select ar.id from assessment_runs ar
    join submissions s on s.id = ar.submission_id
    where s.user_id = auth.uid() or s.is_public = true
  )
);
create policy "users can read own test results" on public.test_results for select using (
  assessment_run_id in (
    select ar.id from assessment_runs ar
    join submissions s on s.id = ar.submission_id
    where s.user_id = auth.uid()
  )
);

-- Service role policies (for Inngest job running as service_role)
create policy "service_role submissions" on public.submissions for all using (auth.role() = 'service_role');
create policy "service_role runs" on public.assessment_runs for all using (auth.role() = 'service_role');
create policy "service_role scores" on public.category_scores for all using (auth.role() = 'service_role');
create policy "service_role results" on public.test_results for all using (auth.role() = 'service_role');

-- Public leaderboard read
create policy "public submissions readable" on public.submissions
  for select using (is_public = true and status = 'complete');

-- Realtime: run these or enable in Supabase dashboard (Database → Replication)
alter publication supabase_realtime add table public.assessment_runs;
alter publication supabase_realtime add table public.category_scores;

-- Trigger: auto-insert user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
