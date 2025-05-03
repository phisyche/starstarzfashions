
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

const SUPABASE_URL = "https://pifzapdqhaxgskypadws.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZnphcGRxaGF4Z3NreXBhZHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTQ2NjIsImV4cCI6MjA2MTM3MDY2Mn0.CPcFj62zuDGbTJNjsGgA7NK2YAACDDlieKCL_QFDg8M";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  }
);

// Utility function for casting tables with proper types
export const from = <T extends keyof Database['public']['Tables']>(
  table: T
) => {
  return supabase.from(table);
};
