import express from 'express';
export const prospectsMvpRouter = express.Router();

interface ProspectMVP {
  id: number;
  name: string;
  category?: string;
  city?: string;
  website?: string;
  email?: string;
  phone?: string;
  gap_analysis?: string;
  pain_points?: string[];
  token?: string;
  lead_score?: number;
  ai_score?: number;
  google_place_id?: string | null;
  signals?: any;
}

const store: ProspectMVP[] = [];

function parseCSV(csv: string): ProspectMVP[] {
  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (!lines.length) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const idx = {
    name: header.indexOf('name'),
    category: header.indexOf('category'),
    city: header.indexOf('city'),
    website: header.indexOf('website'),
    email: header.indexOf('email'),
    phone: header.indexOf('phone'),
    gap_analysis: header.indexOf('gap_analysis'),
    pain_points: header.indexOf('pain_points'),
  };
  const out: ProspectMVP[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const p: ProspectMVP = {
      id: Date.now() + i,
      name: cols[idx.name] ?? '',
      category: cols[idx.category],
      city: cols[idx.city],
      website: cols[idx.website],
      email: cols[idx.email],
      phone: cols[idx.phone],
      gap_analysis: cols[idx.gap_analysis],
      pain_points: cols[idx.pain_points] ? cols[idx.pain_points].split('|') : [],
      token: undefined,
      lead_score: 0,
      ai_score: 0,
      google_place_id: null,
      signals: {},
    };
    out.push(p);
  }
  return out;
}

prospectsMvpRouter.post('/import', (req, res) => {
  let items: ProspectMVP[] = [];
  const body = req.body || {};
  if (Array.isArray(body.prospects)) {
    items = body.prospects as ProspectMVP[];
  } else if (typeof body.csv === 'string') {
    items = parseCSV(body.csv);
  }
  items.forEach((p) => store.push(p));
  res.json({ imported: items.length, total: store.length });
});

prospectsMvpRouter.get('/export', (_req, res) => {
  // Export as CSV for convenience
  const header = ['id','name','category','city','website','email','phone','gap_analysis','pain_points'];
  const rows = store.map(p => [
    p.id,
    p.name,
    p.category || '',
    p.city || '',
    p.website || '',
    p.email || '',
    p.phone || '',
    p.gap_analysis || '',
    (p.pain_points || []).join('|'),
  ]);
  const csv = [header, ...rows].map(r => r.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

// Clear in-memory store (handy for tests)
prospectsMvpRouter.post('/clear', (_req, res) => {
  store.length = 0;
  res.json({ cleared: true, total: store.length });
});

// Clear in-memory store (handy for tests)
prospectsMvpRouter.post('/clear', (_req, res) => {
  store.length = 0;
  res.json({ cleared: true, total: 0 });
});

export default prospectsMvpRouter;
