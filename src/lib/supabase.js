import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

// Only create the client when config exists, so the app can show a setup
// screen instead of crashing when .env is missing.
export const supabase = isConfigured ? createClient(url, anonKey) : null;
