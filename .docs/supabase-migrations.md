```bash
npx supabase --version
npx supabase login
```

```bash
npx supabase link

npx supabase init
npx supabase db push --file libs/supabase/migrations/20240101_init.sql
```

**update the .env in root/supabase**

```migrations.sql
-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Table: users
create table public.users (
    id uuid primary key default uuid_generate_v4(),
    email text not null unique,
    password_hash text not null, -- Store securely hashed passwords
    username text unique,
    created_at timestamp with time zone default now()
);

-- Table: conversations
create table public.conversations (
    id uuid primary key default uuid_generate_v4(),
    participant_one uuid references public.users(id) on delete cascade,
    participant_two uuid references public.users(id) on delete cascade,
    created_at timestamp with time zone default now(),
    unique (participant_one, participant_two)
);

-- Table: messages
create table public.messages (
    id uuid primary key default uuid_generate_v4(),
    conversation_id uuid references public.conversations(id) on delete cascade, -- Associate with conversation
    sender_id uuid references public.users(id) on delete cascade,
    content text not null,
    created_at timestamp with time zone default now()
);

-- Function: Notify on new message for real-time messaging
create or replace function public.notify_new_message()
returns trigger as $$
begin
  perform pg_notify('new_message', json_build_object(
      'message_id', new.id,
      'conversation_id', new.conversation_id,
      'sender_id', new.sender_id,
      'content', new.content,
      'created_at', new.created_at
  )::text);
  return new;
end;
$$ language plpgsql;

-- Trigger: Call notify_new_message on insert into messages
create trigger message_insert_trigger
after insert on public.messages
for each row
execute function public.notify_new_message();

```
