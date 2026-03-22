import { Router, Request, Response } from 'express'

export const mvpAuthRouter = Router()

const adminUser = { id: 1, email: 'admin@example.com', role: 'admin' }

// Minimal mock login for MVP
mvpAuthRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {}
  if (email === adminUser.email && password === 'admin') {
    return res.json({ token: 'admin-token', user: adminUser })
  }
  res.status(401).json({ ok: false, error: 'Invalid credentials' })
})

// Protected fetch of current user (mock)
mvpAuthRouter.get('/me', (req: Request, res: Response) => {
  const auth = (req.headers.authorization || '').toString()
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
  if (token === 'admin-token') {
    return res.json({ user: adminUser })
  }
  res.status(401).json({ ok: false, error: 'Unauthorized' })
})

export default mvpAuthRouter
