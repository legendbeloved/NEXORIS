import { Router, Request, Response } from 'express'

export const mvpProspectsV1 = Router()

let mockProspects = [
  { id: 1, name: 'Acme Corp', status: 'discovered' },
  { id: 2, name: 'Globex', status: 'contacted' }
]

mvpProspectsV1.post('/import', (req: Request, res: Response) => {
  const csv = (req.body as any)?.csv || ''
  if (!csv) return res.status(400).json({ ok: false, error: 'No csv provided' })
  const count = csv.split('\n').filter((l) => l.trim()).length
  res.json({ imported: count })
})

mvpProspectsV1.get('/export', (req: Request, res: Response) => {
  const fmt = (req.query?.format as string) || 'csv'
  if (fmt === 'json') {
    res.json(mockProspects)
    return
  }
  const header = 'id,name,status\n'
  const rows = mockProspects.map(p => `${p.id},${p.name},${p.status}`).join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.send(header + rows)
})

export default mvpProspectsV1
