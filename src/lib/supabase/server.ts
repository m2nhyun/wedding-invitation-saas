import { createClient } from "@supabase/supabase-js";
import { getOptionalEnv, getRequiredEnv } from "@/lib/env";

export function hasSupabaseConfig() {
  return Boolean(
    getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      getOptionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
      getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export function createSupabaseBrowserClient() {
  return createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

export function createSupabaseAdminClient() {
  return createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
