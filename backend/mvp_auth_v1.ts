import { Router } from 'express'
export const mvpAuthV1 = Router()

const admin = { id: 1, email: 'admin@example.com', role: 'admin' }

mvpAuthV1.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  if (email === admin.email && password === 'admin') {
    return res.json({ token: 'admin-token', user: admin })
  }
  res.status(401).json({ ok: false, error: 'Invalid credentials' })
})

mvpAuthV1.get('/me', (req, res) => {
  const auth = (req.headers['authorization'] || '').toString()
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
  if (token === 'admin-token') {
    return res.json({ user: admin })
  }
  res.status(401).json({ ok: false, error: 'Unauthorized' })
})

export default mvpAuthV1
