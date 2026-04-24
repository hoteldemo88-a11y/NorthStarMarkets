import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import pool from './config/db.js'
import { initDatabase } from './config/initDb.js'
import authRoutes from './routes/auth.routes.js'
import clientRoutes from './routes/client.routes.js'
import adminRoutes from './routes/admin.routes.js'
import passwordRoutes from './routes/password.routes.js'
import { closeExpiredTrades } from './utils/trades.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()


const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'north-star-api' })
})

app.get('/api/prices', async (_req, res) => {
  try {
    const [goldRes, silverRes, oilRes, btcRes, ethRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI%3DF?interval=1d&range=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/CL%3DF?interval=1d&range=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?interval=1d&range=1d'),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/ETH-USD?interval=1d&range=1d'),
    ])

    const [goldData, silverData, oilData, btcData, ethData] = await Promise.all([
      goldRes.json(),
      silverRes.json(),
      oilRes.json(),
      btcRes.json(),
      ethRes.json(),
    ])

    const prices = {
      gold: {
        price: goldData?.chart?.result?.[0]?.meta?.regularMarketPrice || 4727.05,
        high: goldData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 4730.42,
        low: goldData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 4726.28,
        change: ((goldData?.chart?.result?.[0]?.meta?.regularMarketPrice - goldData?.chart?.result?.[0]?.meta?.chartPreviousClose) / goldData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 0.02
      },
      silver: {
        price: silverData?.chart?.result?.[0]?.meta?.regularMarketPrice || 76.52,
        high: silverData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 77.00,
        low: silverData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 75.50,
        change: ((silverData?.chart?.result?.[0]?.meta?.regularMarketPrice - silverData?.chart?.result?.[0]?.meta?.chartPreviousClose) / silverData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 0.05
      },
      crude: {
        price: oilData?.chart?.result?.[0]?.meta?.regularMarketPrice || 90.24,
        high: oilData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 95.00,
        low: oilData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 88.00,
        change: ((oilData?.chart?.result?.[0]?.meta?.regularMarketPrice - oilData?.chart?.result?.[0]?.meta?.chartPreviousClose) / oilData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || -1.10
      },
      bitcoin: {
        price: btcData?.chart?.result?.[0]?.meta?.regularMarketPrice || 74242.52,
        high: btcData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 74814.54,
        low: btcData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 74145.62,
        change: ((btcData?.chart?.result?.[0]?.meta?.regularMarketPrice - btcData?.chart?.result?.[0]?.meta?.chartPreviousClose) / btcData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 0.10
      },
      ethereum: {
        price: ethData?.chart?.result?.[0]?.meta?.regularMarketPrice || 2320.05,
        high: ethData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 2344.10,
        low: ethData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 2318.52,
        change: ((ethData?.chart?.result?.[0]?.meta?.regularMarketPrice - ethData?.chart?.result?.[0]?.meta?.chartPreviousClose) / ethData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || -0.15
      },
    }

    res.json(prices)
  } catch (error) {
    console.error('Price fetch error:', error.message)
    res.status(500).json({ 
      error: 'Failed to fetch prices',
      fallback: {
        gold: { price: 4727.05, high: 4730.42, low: 4726.28, change: 0.02 },
        silver: { price: 76.52, high: 77.00, low: 75.50, change: 0.05 },
        crude: { price: 65.00, high: 70.00, low: 60.00, change: -1.00 },
        bitcoin: { price: 74000.00, high: 75000.00, low: 73000.00, change: 0.50 },
        ethereum: { price: 1650.00, high: 1700.00, low: 1600.00, change: 0.30 },
      }
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/password', passwordRoutes)

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

    app.listen(port, '0.0.0.0', () => console.log(`API running on port ${port}`))
  } catch (error) {
    console.error('Failed to start API', error)
    process.exit(1)
  }
}

boot()
