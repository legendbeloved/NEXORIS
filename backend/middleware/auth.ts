import { Request, Response, NextFunction } from 'express'
import { getUserByToken } from '../auth'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'] as string | undefined
  const token = header?.startsWith('Bearer ') ? header.slice(7) : header || ''
  const user = token ? getUserByToken(token) : null
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  // attach user to request for downstream handlers
  ;(req as any).user = user
  next()
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const u = (req as any).user
    if (!u || u.role !== role) {
      return res.status(403).json({ ok: false, error: 'Forbidden' })
    }
    next()
  }
}
