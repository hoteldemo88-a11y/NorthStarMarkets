import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import pool from './config/db.js'
import { initDatabase } from './config/initDb.js'
import authRoutes from './routes/auth.routes.js'
import clientRoutes from './routes/client.routes.js'
import adminRoutes from './routes/admin.routes.js'
import { closeExpiredTrades } from './utils/trades.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'north-star-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/admin', adminRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@northstarmarkets.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345'
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  if (rows.length) return

  const hash = await bcrypt.hash(password, 12)
  await pool.query(
    'INSERT INTO users (username, email, password_hash, role, balance, first_name, last_name) VALUES (?, ?, ?, "admin", 0, ?, ?)',
    ['admin', email, hash, 'System', 'Administrator'],
  )
  console.log(`Admin bootstrap user created: ${email}`)
}

async function boot() {
  try {
    await initDatabase()
    await pool.query('SELECT 1')
    await ensureAdminUser()

    await closeExpiredTrades()
    setInterval(async () => {
      try {
        await closeExpiredTrades()
      } catch (error) {
        console.error('Failed auto-close expired trades', error.message)
      }
    }, 60 * 1000)

    app.listen(port, () => console.log(`API running on http://localhost:${port}`))
  } catch (error) {
    console.error('Failed to start API', error)
    process.exit(1)
  }
}

boot()
