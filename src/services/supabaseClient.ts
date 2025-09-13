import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  'https://awqksznhebrfdozqqgij.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cWtzem5oZWJyZmRvenFxZ2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODQxOTYsImV4cCI6MjA3MzM2MDE5Nn0.FD3gFnsT57MluLimTgMy7Ss-ocuZs1kgzVszCCfI8xg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
