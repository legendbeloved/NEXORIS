import { createClient } from "@supabase/supabase-js";

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || env.VITE_NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const createStubClient = () => {
  const error = { message: "Supabase is not configured" } as any;
  const channel = {
    on() {
      return channel;
    },
    subscribe() {
      return channel;
    },
  } as any;

  return {
    auth: {
      signInWithPassword: async () => ({ data: { session: null }, error }),
      signInWithOAuth: async () => ({ data: null, error }),
      signUp: async () => ({ data: null, error }),
      resetPasswordForEmail: async () => ({ data: null, error }),
      updateUser: async () => ({ data: null, error }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    channel: () => channel,
    removeChannel: async () => {},
  } as any;
};

const isSupabaseAdminConfigured = Boolean(supabaseUrl && supabaseServiceKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : (createStubClient() as any);

export const supabaseClient = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : (createStubClient() as any);
