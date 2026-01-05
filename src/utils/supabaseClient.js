import { createClient } from '@supabase/supabase-js';

// Ganti URL dan KEY ini dengan yang ada di Dashboard Supabase kamu nanti
const supabaseUrl = 'https://mrkeolrqhtbrsqbmadrj.supabase.co';
const supabaseAnonKey = 'sb_publishable_vKTVVEm5NaB17TXIqTZyyw_JSS3kTp7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);