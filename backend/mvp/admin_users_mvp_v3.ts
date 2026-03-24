import express from 'express';
export const adminUsersMvpRouter = express.Router();

// Simple MVP guard to simulate admin auth for tests
adminUsersMvpRouter.use((req, res, next) => {
  const token = String(req.headers['x-mvp-auth'] || '').toLowerCase();
  if (token === 'demo') return next();
  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  // treat any non-empty value as allowed in this MVP context (adjust as needed)
  next();
});

let users = [
  { id: 1, name: 'Alice Admin', email: 'alice@example.com' },
  { id: 2, name: 'Bob User', email: 'bob@example.com' },
];

adminUsersMvpRouter.get('/users', (_req, res) => {
  let result = [...users];
  const q = _req.query?.search?.toString?.() || _req.query?.name?.toString?.() || '';
  if (q) {
    result = result.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
  }
  const page = Number(_req.query?.page) || 1;
  const limit = Math.max(1, Number(_req.query?.limit) || 10);
  const from = (page - 1) * limit;
  const to = from + limit;
  res.json({ users: result.slice(from, to), total: result.length });
});

adminUsersMvpRouter.post('/users', (_req, res) => {
  const { name, email } = _req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const id = (users.length ? Math.max(...users.map(u => u.id)) : 0) + 1;
  const user = { id, name, email };
  users.push(user);
  res.json(user);
});

adminUsersMvpRouter.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const u = users.find(u => u.id === id);
  if (!u) return res.status(404).json({ error: 'not found' });
  res.json(u);
});

adminUsersMvpRouter.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex(u => u.id === id);
  if (idx < 0) return res.status(404).json({ error: 'not found' });
  const patch = req.body || {};
  users[idx] = { ...users[idx], ...patch };
  res.json(users[idx]);
});

adminUsersMvpRouter.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex(u => u.id === id);
  if (idx < 0) return res.status(404).json({ error: 'not found' });
  users.splice(idx, 1);
  res.json({ status: 'ok' });
});

// Reset users (useful for tests)
adminUsersMvpRouter.post('/reset', (_req, res) => {
  users = [
    { id: 1, name: 'Alice Admin', email: 'alice@example.com' },
    { id: 2, name: 'Bob User', email: 'bob@example.com' },
  ];
  res.json({ reset: true, count: users.length });
});

export default adminUsersMvpRouter;
