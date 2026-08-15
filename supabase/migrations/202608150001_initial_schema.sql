create extension if not exists pgcrypto;
create extension if not exists vector;

create type public.app_role as enum ('student','admin');
create type public.exam_status as enum ('GENERATING','ACTIVE','SUBMITTED','ABANDONED');
create type public.validation_status as enum ('PENDING','VALID','REJECTED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null unique check (lower(email) like '%@gmail.com'),
  rut_encrypted text not null,
  rut_hash text not null unique,
  role public.app_role not null default 'student',
  status text not null default 'PENDING_EMAIL',
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(), axis text not null, unit text not null, topic text not null,
  primary_skill text not null, secondary_skill text, difficulty smallint not null check (difficulty between 1 and 5),
  context_type text not null, resource_type text not null, statement text not null,
  options_json jsonb not null check (jsonb_object_length(options_json)=4), correct_answer char(1) not null check (correct_answer in ('A','B','C','D')),
  solution text not null, distractor_reasoning_json jsonb not null default '{}', visual_data_json jsonb,
  validation_status public.validation_status not null default 'PENDING', semantic_embedding vector(1536), structural_fingerprint text not null,
  created_at timestamptz not null default now(), usage_count integer not null default 0, correct_rate numeric(5,4),
  average_response_time numeric(10,2), discrimination_index numeric(6,4), flagged boolean not null default false
);

create table public.exams (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  status public.exam_status not null default 'GENERATING', created_at timestamptz not null default now(), started_at timestamptz,
  submitted_at timestamptz, score numeric(5,2), correct_count smallint, total_questions smallint not null default 65,
  time_used_seconds integer, last_position smallint not null default 1, submission_key uuid unique
);
create unique index one_active_exam_per_user on public.exams(user_id) where status in ('GENERATING','ACTIVE');

create table public.exam_questions (
  id uuid primary key default gen_random_uuid(), exam_id uuid not null references public.exams(id) on delete cascade,
  question_id uuid not null references public.questions(id), position smallint not null check (position between 1 and 65),
  unique(exam_id,position), unique(exam_id,question_id)
);
create table public.answers (
  id uuid primary key default gen_random_uuid(), exam_id uuid not null references public.exams(id) on delete cascade,
  question_id uuid not null references public.questions(id), selected_answer char(1) check (selected_answer in ('A','B','C','D')),
  is_correct boolean, response_time_seconds integer check (response_time_seconds>=0), created_at timestamptz not null default now(),
  unique(exam_id,question_id)
);
create table public.question_exposures (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id), exam_id uuid not null references public.exams(id) on delete cascade,
  shown_at timestamptz not null default now(), unique(user_id,question_id)
);
create table public.feedback (
  id uuid primary key default gen_random_uuid(), exam_id uuid not null unique references public.exams(id) on delete cascade,
  overall_feedback text not null, strengths_json jsonb not null default '[]', weaknesses_json jsonb not null default '[]',
  recommendations_json jsonb not null default '[]', created_at timestamptz not null default now()
);
create table public.generated_reports (
  id uuid primary key default gen_random_uuid(), exam_id uuid not null unique references public.exams(id) on delete cascade,
  storage_path text not null, created_at timestamptz not null default now()
);
create table public.email_logs (
  id uuid primary key default gen_random_uuid(), exam_id uuid not null references public.exams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, email text not null, status text not null,
  provider_message_id text, error_code text, created_at timestamptz not null default now()
);

create index questions_blueprint_idx on public.questions(axis,unit,difficulty) where validation_status='VALID' and flagged=false;
create index questions_fingerprint_idx on public.questions(structural_fingerprint);
create index exposures_user_idx on public.question_exposures(user_id,question_id);
create index exams_user_status_idx on public.exams(user_id,status);
create index answers_exam_idx on public.answers(exam_id);

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.answers enable row level security;
alter table public.question_exposures enable row level security;
alter table public.feedback enable row level security;
alter table public.generated_reports enable row level security;
alter table public.email_logs enable row level security;

create policy "own profile read" on public.profiles for select using (auth.uid()=id);
create policy "own profile update safe" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id and role='student');
create policy "own exams read" on public.exams for select using (auth.uid()=user_id);
create policy "own exam questions read" on public.exam_questions for select using (exists(select 1 from public.exams e where e.id=exam_id and e.user_id=auth.uid()));
create policy "own answers read" on public.answers for select using (exists(select 1 from public.exams e where e.id=exam_id and e.user_id=auth.uid()));
create policy "own answers insert" on public.answers for insert with check (exists(select 1 from public.exams e where e.id=exam_id and e.user_id=auth.uid() and e.status='ACTIVE'));
create policy "own answers update" on public.answers for update using (exists(select 1 from public.exams e where e.id=exam_id and e.user_id=auth.uid() and e.status='ACTIVE'));
create policy "own feedback read" on public.feedback for select using (exists(select 1 from public.exams e where e.id=exam_id and e.user_id=auth.uid() and e.status='SUBMITTED'));
create policy "own reports read" on public.generated_reports for select using (exists(select 1 from public.exams e where e.id=exam_id and e.user_id=auth.uid() and e.status='SUBMITTED'));
-- Deliberately no student SELECT policy on questions or question_exposures. Secure server functions return sanitized projections.

create or replace function public.touch_question_usage() returns trigger language plpgsql security definer set search_path=public as $$
begin update public.questions set usage_count=usage_count+1 where id=new.question_id; return new; end $$;
create trigger question_exposure_usage after insert on public.question_exposures for each row execute function public.touch_question_usage();

revoke all on public.questions from anon, authenticated;
grant select,update on public.profiles to authenticated;
grant select on public.exams,public.exam_questions,public.feedback,public.generated_reports to authenticated;
grant select,insert,update on public.answers to authenticated;
