import express from 'express';
export const prospectsMvpRouter = express.Router();

const store: any[] = [];

prospectsMvpRouter.post('/import', (req, res) => {
  const items = Array.isArray(req.body?.prospects) ? req.body.prospects : [];
  items.forEach((p) => store.push(p));
  res.json({ imported: items.length, total: store.length });
});

prospectsMvpRouter.get('/export', (_req, res) => {
  res.json({ prospects: store });
});

// Clear in-memory store (handy for tests)
prospectsMvpRouter.post('/clear', (_req, res) => {
  store.length = 0;
  res.json({ cleared: true, total: 0 });
});

export default prospectsMvpRouter;
