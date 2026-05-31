// CONFIGURATION FILE FOR ESSENSPLANER CHATBOT

const CONFIG = {
  // Trage hier deine Supabase-Verbindungsdaten ein
  SUPABASE_URL: "DEINE_SUPABASE_URL",
  SUPABASE_ANON_KEY: "DEIN_SUPABASE_ANON_KEY",

  // Passwort für die Admin-Ansicht (wenn du ?admin=true aufrufst)
  ADMIN_PASSWORD: "essen", 

  // Name des Partners, der standardmäßig für Berichte und Anrede verwendet wird
  PARTNER_NAME: "Schatz"
};

/*
================================================================================
SQL-SKRIPT FÜR SUPABASE:
Führe dieses Skript im "SQL Editor" deines Supabase-Projekts aus, um die 
Tabelle zu erstellen.
================================================================================

create table public.food_preferences (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  partner_name text default 'Freundin',
  favorite_dishes text[] default '{}'::text[],
  vegetables_love text[] default '{}'::text[],
  vegetables_hate text[] default '{}'::text[],
  carbs_preferences text[] default '{}'::text[],
  meat_preference text,
  cuisine_preferences text[] default '{}'::text[],
  meal_types text[] default '{}'::text[],
  snack_style text,
  custom_feedback text,
  summary text
);

-- RLS (Row Level Security) aktivieren oder für unkomplizierte Nutzung deaktivieren.
-- Falls aktiviert, erlaube Inserts für anonyme Benutzer:
alter table public.food_preferences enable row level security;
create policy "Allow anonymous insert" on public.food_preferences for insert with check (true);
create policy "Allow select for authenticated" on public.food_preferences for select using (true);

================================================================================
*/
window.CONFIG = CONFIG;
