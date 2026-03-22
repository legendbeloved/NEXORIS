import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Lightweight diagnostics for Next.js API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  const required = ['DATABASE_URL','REDIS_URL','CACHE_URL','API_BASE_URL']
  const missing = required.filter((k) => !process.env[k])
  const ok = missing.length === 0

  const supabaseUrlPresent = !!(process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKeyPresent = !!(process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  const serviceReady = ok && supabaseUrlPresent && supabaseKeyPresent

  let connectivity = { ok: false, error: '' as string };
  try {
    if (supabaseUrlPresent && supabaseKeyPresent) {
      const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      const client = createClient(url, key)
      const { error } = await client.from('settings').select('*').limit(1).single()
      connectivity = { ok: !error, error: error?.message ?? '' }
    }
  } catch (e: any) {
    connectivity = { ok: false, error: String(e?.message || e) }
  }

  res.status(200).json({ ok, missing, supabaseUrlPresent, supabaseKeyPresent, serviceReady, connectivity })
}
