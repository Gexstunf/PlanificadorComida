-- Meal Planner full Supabase schema
-- Run this file in the Supabase SQL Editor before using the app.
-- It creates the application tables, Row Level Security policies, and the image bucket.

create extension if not exists "pgcrypto";

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  instructions text default '',
  image_url text,
  calories integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  prep_time_min integer,
  difficulty text default 'Easy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  quantity text,
  unit text default 'g',
  created_at timestamptz not null default now()
);

create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner')),
  recipe_id uuid references public.recipes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meal_plan_id, day_of_week, meal_type)
);

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

create index if not exists recipes_user_created_idx on public.recipes (user_id, created_at desc);
create index if not exists recipe_ingredients_recipe_idx on public.recipe_ingredients (recipe_id);
create index if not exists meal_plans_user_week_idx on public.meal_plans (user_id, week_start);
create index if not exists meal_plan_entries_plan_idx on public.meal_plan_entries (meal_plan_id);
create index if not exists favorite_recipes_user_idx on public.favorite_recipes (user_id);
create index if not exists shopping_checks_user_week_idx on public.shopping_checks (user_id, week_start);

alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meal_plan_entries enable row level security;
alter table public.favorite_recipes enable row level security;
alter table public.user_nutrition_goals enable row level security;
alter table public.shopping_checks enable row level security;

drop policy if exists "recipes_owner" on public.recipes;
create policy "recipes_owner" on public.recipes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "recipe_ingredients_owner" on public.recipe_ingredients;
create policy "recipe_ingredients_owner" on public.recipe_ingredients
  for all using (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.recipes
      where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = auth.uid()
    )
  );

drop policy if exists "meal_plans_owner" on public.meal_plans;
create policy "meal_plans_owner" on public.meal_plans
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "meal_plan_entries_owner" on public.meal_plan_entries;
create policy "meal_plan_entries_owner" on public.meal_plan_entries
  for all using (
    exists (
      select 1 from public.meal_plans
      where meal_plans.id = meal_plan_entries.meal_plan_id
      and meal_plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.meal_plans
      where meal_plans.id = meal_plan_entries.meal_plan_id
      and meal_plans.user_id = auth.uid()
    )
    and (
      recipe_id is null
      or exists (
        select 1 from public.recipes
        where recipes.id = meal_plan_entries.recipe_id
        and recipes.user_id = auth.uid()
      )
    )
  );

drop policy if exists "favorite_recipes_owner" on public.favorite_recipes;
create policy "favorite_recipes_owner" on public.favorite_recipes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_nutrition_goals_owner" on public.user_nutrition_goals;
create policy "user_nutrition_goals_owner" on public.user_nutrition_goals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "shopping_checks_owner" on public.shopping_checks;
create policy "shopping_checks_owner" on public.shopping_checks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "recipe_images_public_read" on storage.objects;
create policy "recipe_images_public_read" on storage.objects
  for select using (bucket_id = 'recipe-images');

drop policy if exists "recipe_images_owner_upload" on storage.objects;
create policy "recipe_images_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "recipe_images_owner_update" on storage.objects;
create policy "recipe_images_owner_update" on storage.objects
  for update using (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "recipe_images_owner_delete" on storage.objects;
create policy "recipe_images_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'recipe-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
