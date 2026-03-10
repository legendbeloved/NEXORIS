import { beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

export const TEST_SUPABASE_URL = process.env.TEST_SUPABASE_URL || "";
export const TEST_SUPABASE_SERVICE_ROLE_KEY = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseTest = TEST_SUPABASE_URL && TEST_SUPABASE_SERVICE_ROLE_KEY
  ? createClient(TEST_SUPABASE_URL, TEST_SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })
  : null;

beforeAll(async () => {
  // Optionally seed data
});

afterAll(async () => {
  // Optionally cleanup data
});
