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

let priceCache = { data: null, timestamp: 0 }
const CACHE_TTL = 300000 // 5 minutes cache

const FALLBACK_PRICES = {
  gold: { price: 2350.00, high: 2400.00, low: 2320.00, change: 0.35 },
  silver: { price: 30.50, high: 31.20, low: 29.80, change: -0.42 },
  crude: { price: 76.50, high: 78.00, low: 75.00, change: 0.85 },
  bitcoin: { price: 102500.00, high: 105000.00, low: 100000.00, change: 1.25 },
  ethereum: { price: 3650.00, high: 3750.00, low: 3550.00, change: 0.95 },
}

async function fetchYahooFinance(symbol) {
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        const data = await res.json()
        const meta = data?.chart?.result?.[0]?.meta
        if (meta?.regularMarketPrice) return meta
      }
    } catch { }
  }
  return null
}

async function fetchMetalsLive() {
  try {
    const res = await fetch('https://api.metals.live/v1/spot/gold', { signal: AbortSignal.timeout(5000) })
    if (res.ok) {
      const data = await res.json()
      return { gold: Number(data?.gold) || null, silver: Number(data?.silver) || null }
    }
  } catch { }
  return { gold: null, silver: null }
}

async function fetchCoinGecko() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd', { signal: AbortSignal.timeout(5000) })
    if (res.ok) {
      const data = await res.json()
      return { bitcoin: data?.bitcoin?.usd || null, ethereum: data?.ethereum?.usd || null }
    }
  } catch { }
  return { bitcoin: null, ethereum: null }
}

function buildPriceEntry(price, prevClose, fallback) {
  return {
    price: price || fallback.price,
    high: price ? price * 1.02 : fallback.high,
    low: price ? price * 0.98 : fallback.low,
    change: (price && prevClose) ? ((price - prevClose) / prevClose * 100) : fallback.change,
  }
}

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'north-star-api' })
})

app.get('/api/prices', async (_req, res) => {
  const now = Date.now()
  
  if (priceCache.data && (now - priceCache.timestamp) < CACHE_TTL) {
    return res.json(priceCache.data)
  }

  try {
    const [yahooGold, yahooSilver, yahooOil, yahooBtc, yahooEth, metals, coingecko] = await Promise.all([
      fetchYahooFinance('GC%3DF'),
      fetchYahooFinance('SI%3DF'),
      fetchYahooFinance('CL%3DF'),
      fetchYahooFinance('BTC-USD'),
      fetchYahooFinance('ETH-USD'),
      fetchMetalsLive(),
      fetchCoinGecko(),
    ])

    const goldPrice = yahooGold?.regularMarketPrice || metals?.gold || FALLBACK_PRICES.gold.price
    const silverPrice = yahooSilver?.regularMarketPrice || metals?.silver || FALLBACK_PRICES.silver.price
    const crudePrice = yahooOil?.regularMarketPrice || FALLBACK_PRICES.crude.price
    const btcPrice = yahooBtc?.regularMarketPrice || coingecko?.bitcoin || FALLBACK_PRICES.bitcoin.price
    const ethPrice = yahooEth?.regularMarketPrice || coingecko?.ethereum || FALLBACK_PRICES.ethereum.price

    const prices = {
      gold: buildPriceEntry(goldPrice, yahooGold?.chartPreviousClose, FALLBACK_PRICES.gold),
      silver: buildPriceEntry(silverPrice, yahooSilver?.chartPreviousClose, FALLBACK_PRICES.silver),
      crude: buildPriceEntry(crudePrice, yahooOil?.chartPreviousClose, FALLBACK_PRICES.crude),
      bitcoin: buildPriceEntry(btcPrice, yahooBtc?.chartPreviousClose, FALLBACK_PRICES.bitcoin),
      ethereum: buildPriceEntry(ethPrice, yahooEth?.chartPreviousClose, FALLBACK_PRICES.ethereum),
    }

    priceCache = { data: prices, timestamp: now }
    res.json(prices)
  } catch (error) {
    console.error('Price fetch error:', error.message)
    if (priceCache.data) {
      return res.json(priceCache.data)
    }
    res.status(500).json({ error: 'Failed to fetch prices', fallback: FALLBACK_PRICES })
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
