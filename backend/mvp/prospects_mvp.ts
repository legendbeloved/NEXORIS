import { Router, Request, Response } from 'express'

export const mvpProspectsRouter = Router()

let mockProspects = [
  { id: 1, name: 'Acme Corp', status: 'discovered' },
  { id: 2, name: 'Globex', status: 'contacted' }
]

// Simple import: accepts JSON with { csv: 'col1,col2\nval1,val2' }
mvpProspectsRouter.post('/prospects/import', (req: Request, res: Response) => {
  const payload = req.body as any
  const csv = payload?.csv || ''
  if (!csv) return res.status(400).json({ ok: false, error: 'no-csv' })
  const lines = csv.split('\n').filter(s => s.trim()).length
  // Do not persist in MVP; just return count
  res.json({ imported: lines })
})

mvpProspectsRouter.get('/prospects/export', (req: Request, res: Response) => {
  const format = (req.query?.format as string) || 'csv'
  if (format === 'json') {
    res.json(mockProspects)
    return
  }
  // CSV export
  const header = 'id,name,status\n'
  const rows = mockProspects.map(p => `${p.id},${p.name},${p.status}`).join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.send(header + rows)
})

export default mvpProspectsRouter
