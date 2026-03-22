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

// Logout endpoint: revoke token if provided
authMvpRouter.post('/logout', (req, res) => {
  const authHeader = (req.headers['authorization'] || '') as string;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.body?.token || '');
  if (token && sessions.has(token)) {
    sessions.delete(token);
    return res.json({ ok: true, loggedOut: true });
  }
  res.status(400).json({ ok: false, error: 'invalid_token' });
});

// Optional refresh endpoint: issue a new token for the same user
authMvpRouter.post('/refresh', (req, res) => {
  const authHeader = (req.headers['authorization'] || '') as string;
  const oldToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.body?.token || '');
  const user = oldToken && sessions.has(oldToken) ? sessions.get(oldToken) : null;
  if (!user) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const newToken = Buffer.from(`${user}:${Date.now()}`).toString('base64');
  sessions.delete(oldToken);
  sessions.set(newToken, user);
  res.json({ ok: true, token: newToken, user: { username: user } });
});

export default authMvpRouter;
