import express, { Express } from 'express'
import { createClient } from '@supabase/supabase-js'

// Tiny diagnostics module to expose environment readiness without leaking secrets
export function attachDiagnostics(app: Express) {
  // Non-secret env vars that indicate essential services are configured
  const required = [
    'DATABASE_URL',
    'REDIS_URL',
    'CACHE_URL',
    'API_BASE_URL'
  ]

  app.get('/api/diagnostics', async (req, res) => {
    const missing = required.filter((k) => !process.env[k])
    const ok = missing.length === 0

    // Additional lightweight checks for Supabase config
    const supabaseUrlPresent = !!(process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
    const supabaseKeyPresent = !!(process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)

    const serviceReady = ok && supabaseUrlPresent && supabaseKeyPresent

    // Live connectivity test to Supabase when possible
    let connectivity: { ok: boolean; error: string } = { ok: false, error: '' }
    try {
      if (supabaseUrlPresent && supabaseKeyPresent) {
        const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        const client = createClient(url, key);
        const { error } = await client.from('settings').select('value').limit(1).single();
        connectivity = { ok: !error, error: error?.message ?? '' };
      }
    } catch (e: any) {
      connectivity = { ok: false, error: String(e?.message || e) };
    }

    res.json({ ok, missing, supabaseUrlPresent, supabaseKeyPresent, serviceReady, connectivity })
  })
}
