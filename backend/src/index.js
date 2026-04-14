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
        price: goldData?.chart?.result?.[0]?.meta?.regularMarketPrice || 4788.76,
        high: goldData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 4812.80,
        low: goldData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 4750.00,
        change: ((goldData?.chart?.result?.[0]?.meta?.regularMarketPrice - goldData?.chart?.result?.[0]?.meta?.chartPreviousClose) / goldData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 1.10
      },
      silver: {
        price: silverData?.chart?.result?.[0]?.meta?.regularMarketPrice || 77.40,
        high: silverData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 78.50,
        low: silverData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 76.00,
        change: ((silverData?.chart?.result?.[0]?.meta?.regularMarketPrice - silverData?.chart?.result?.[0]?.meta?.chartPreviousClose) / silverData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 5.08
      },
      crude: {
        price: oilData?.chart?.result?.[0]?.meta?.regularMarketPrice || 91.38,
        high: oilData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 95.00,
        low: oilData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 90.00,
        change: ((oilData?.chart?.result?.[0]?.meta?.regularMarketPrice - oilData?.chart?.result?.[0]?.meta?.chartPreviousClose) / oilData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || -3.50
      },
      bitcoin: {
        price: btcData?.chart?.result?.[0]?.meta?.regularMarketPrice || 74763.31,
        high: btcData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 75200.00,
        low: btcData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 73900.00,
        change: ((btcData?.chart?.result?.[0]?.meta?.regularMarketPrice - btcData?.chart?.result?.[0]?.meta?.chartPreviousClose) / btcData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 0.30
      },
      ethereum: {
        price: ethData?.chart?.result?.[0]?.meta?.regularMarketPrice || 2370.51,
        high: ethData?.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[0] || 2400.00,
        low: ethData?.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[0] || 2350.00,
        change: ((ethData?.chart?.result?.[0]?.meta?.regularMarketPrice - ethData?.chart?.result?.[0]?.meta?.chartPreviousClose) / ethData?.chart?.result?.[0]?.meta?.chartPreviousClose * 100) || 0.03
      },
    }

    res.json(prices)
  } catch (error) {
    console.error('Price fetch error:', error.message)
    res.status(500).json({ 
      error: 'Failed to fetch prices',
      fallback: {
        gold: { price: 4788.76, high: 4812.80, low: 4750.00, change: 1.10 },
        silver: { price: 77.40, high: 78.50, low: 76.00, change: 5.08 },
        crude: { price: 91.38, high: 95.00, low: 90.00, change: -3.50 },
        bitcoin: { price: 74763.31, high: 75200.00, low: 73900.00, change: 0.30 },
        ethereum: { price: 2370.51, high: 2400.00, low: 2350.00, change: 0.03 },
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
