-- Optional Meal OS upgrade migration
-- Run this in Supabase SQL editor to enable synced favorites, nutrition goals, shopping checks, and real recipe nutrition.

alter table public.recipes
  add column if not exists calories integer,
  add column if not exists protein_g numeric,
  add column if not exists carbs_g numeric,
  add column if not exists fat_g numeric,
  add column if not exists prep_time_min integer,
  add column if not exists difficulty text default 'Easy';

create table if not exists public.favorite_recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create table if not exists public.user_nutrition_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  calorie_goal integer default 2200,
  protein_goal integer default 140,
  weekly_budget numeric default 65000,
  preferences text default '',
  restrictions text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_checks (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  item_key text not null,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start, item_key)
);

alter table public.favorite_recipes enable row level security;
alter table public.user_nutrition_goals enable row level security;
alter table public.shopping_checks enable row level security;

drop policy if exists "favorite_recipes_owner" on public.favorite_recipes;
create policy "favorite_recipes_owner" on public.favorite_recipes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_nutrition_goals_owner" on public.user_nutrition_goals;
create policy "user_nutrition_goals_owner" on public.user_nutrition_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "shopping_checks_owner" on public.shopping_checks;
create policy "shopping_checks_owner" on public.shopping_checks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
