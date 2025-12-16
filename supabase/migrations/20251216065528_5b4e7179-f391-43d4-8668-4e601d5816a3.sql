-- =============================================
-- WELLNORA DATABASE SCHEMA
-- Simple, readable, daily wellbeing tracking
-- =============================================

-- 1. PROFILES TABLE (linked to auth.users)
-- Stores basic user identity and preferences
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  timezone text default 'UTC',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. ACTIVITY TYPES TABLE
-- Reference table for the 5 supported activities
create table public.activity_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.activity_types enable row level security;

-- Activity types are readable by all authenticated users
create policy "Activity types are viewable by authenticated users"
  on public.activity_types for select
  to authenticated
  using (true);

-- Seed the 5 core activities
insert into public.activity_types (name) values
  ('walking'),
  ('sleeping'),
  ('stretching'),
  ('hydration'),
  ('mindfulness');

-- 3. ACTIVITY LOGS TABLE (CORE)
-- One row per user + activity + date
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type_id uuid not null references public.activity_types(id) on delete cascade,
  date date not null default current_date,
  completed boolean not null default false,
  duration_minutes integer,
  sleep_duration_hours decimal(3,1),
  hydration_units integer,
  created_at timestamptz not null default now(),
  
  -- Ensure one log per user per activity per day
  unique (user_id, activity_type_id, date)
);

alter table public.activity_logs enable row level security;

create policy "Users can view their own activity logs"
  on public.activity_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own activity logs"
  on public.activity_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own activity logs"
  on public.activity_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own activity logs"
  on public.activity_logs for delete
  using (auth.uid() = user_id);

-- Index for efficient date-based queries
create index idx_activity_logs_user_date on public.activity_logs(user_id, date);

-- 4. AI INSIGHTS TABLE
-- Lightweight AI-generated summaries
create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  insight_text text not null,
  insight_type text not null check (insight_type in ('daily', 'weekly', 'encouragement')),
  generated_for_date date not null,
  created_at timestamptz not null default now()
);

alter table public.ai_insights enable row level security;

create policy "Users can view their own insights"
  on public.ai_insights for select
  using (auth.uid() = user_id);

create policy "Users can insert their own insights"
  on public.ai_insights for insert
  with check (auth.uid() = user_id);

-- Index for date-based insight queries
create index idx_ai_insights_user_date on public.ai_insights(user_id, generated_for_date);

-- 5. USER SETTINGS TABLE
-- Minimal preferences (1-to-1 with users)
create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.update_updated_at_column();