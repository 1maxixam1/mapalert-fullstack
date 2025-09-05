import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Client } from 'pg'

const app = express()
const port = process.env.PORT || 4000
const client = new Client({ connectionString: process.env.DATABASE_URL })

app.use(express.json({ limit:'5mb' }))
app.use(cors({
  origin: (origin, cb) => {
    const allowed = (process.env.CORS_ORIGIN || '').split(',').map(s=>s.trim()).filter(Boolean)
    if (!origin || allowed.length===0 || allowed.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS: '+origin))
  },
  credentials: true
}))

// Connect once at boot
client.connect().then(()=>console.log('DB connected')).catch(err=>{
  console.error('DB connection error', err)
  process.exit(1)
})

// Helper to purge expired marks
async function cleanupExpired() {
  await client.query('DELETE FROM marks WHERE expires_at <= NOW()')
}

// Routes
app.get('/api/health', (_, res)=> res.json({ ok: true }))

app.get('/api/marks', async (req, res) => {
  await cleanupExpired()
  const { rows } = await client.query('SELECT * FROM marks WHERE expires_at > NOW() ORDER BY id DESC')
  res.json(rows)
})

app.post('/api/marks', async (req, res) => {
  const { text, lat, lng, imageBase64, ttlDays } = req.body || {}
  if (!text || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'text, lat, lng requeridos' })
  }
  const ttl = Number(ttlDays) > 0 ? Number(ttlDays) : 7
  const { rows } = await client.query(
  `INSERT INTO marks (text, lat, lng, image_base64, expires_at)
   VALUES ($1, $2, $3, $4, NOW() + ($5::int) * INTERVAL '1 day')
   RETURNING *`,
  [text, lat, lng, imageBase64 || null, ttl]
)
  res.status(201).json(rows[0])
})

app.delete('/api/marks/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'id invalido' })
  await client.query('DELETE FROM marks WHERE id=$1', [id])
  res.json({ ok: true })
})

app.post('/api/cleanup', async (req, res) => {
  await cleanupExpired()
  res.json({ ok: true })
})

app.listen(port, ()=> console.log('API on :' + port))
