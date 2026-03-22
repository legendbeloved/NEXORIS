import express from 'express';
export const authMvpRouter = express.Router();

// Simple in-memory session store (for MVP testing only)
const sessions = new Map<string, string>(); // token -> username

authMvpRouter.post('/login', (req, res) => {
  const { username = 'guest', password = 'pass' } = (req.body || {});
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  sessions.set(token, String(username));
  res.json({ ok: true, token, user: { username } });
});

authMvpRouter.get('/status', (req, res) => {
  const authHeader = (req.headers['authorization'] || '') as string;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const user = token ? sessions.get(token) : undefined;
  res.json({ ok: true, authenticated: !!user, user: user ? { username: user } : null });
});

export default authMvpRouter;
