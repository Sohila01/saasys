import { createClient } from '@supabase/supabase-js';

// Use Vite env vars (VITE_*) at build time. Do NOT expose service_role keys here.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseKey = (import.meta.env.VITE_SUPABASE_KEY as string) || '';

if (typeof window !== 'undefined') {
  console.log('Supabase Config:', { 
    url: supabaseUrl ? 'SET' : 'MISSING', 
    key: supabaseKey ? 'SET' : 'MISSING' 
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase env not set: VITE_SUPABASE_URL or VITE_SUPABASE_KEY is missing. Client requests may fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
