-- Run in Supabase SQL editor
create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_dental_office boolean not null default false,
  created_at timestamptz not null default now()
);
