import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  'https://lqperuhedxvpperyirca.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcGVydWhlZHh2cHBlcnlpcmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzY4ODcsImV4cCI6MjA4MDExMjg4N30.zlRtpDazaH4zcWKegtoTgHCUlGtqFKBKpiotC849f6Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
