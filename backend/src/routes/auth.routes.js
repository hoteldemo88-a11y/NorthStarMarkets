import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { authenticate } from '../middleware/auth.js'
import { signToken } from '../utils/tokens.js'
import { logActivity } from '../utils/activity.js'

const router = Router()

router.post('/register', async (req, res) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    phone,
    country,
    dateOfBirth,
    annualIncome,
    netWorth,
    employmentStatus,
    sourceOfFunds,
    usCitizen,
    pepStatus,
    taxResidency,
    riskTolerance,
    investmentHorizon,
    maxDrawdown,
    yearsTrading,
    productsTraded,
    averageTradesPerMonth,
    preferredMarkets,
    strategyStyle,
    preferredLeverage,
  } = req.body

  const requiredValues = {
    username,
    email,
    password,
    firstName,
    lastName,
    phone,
    country,
    dateOfBirth,
    annualIncome,
    netWorth,
    employmentStatus,
    sourceOfFunds,
    usCitizen,
    pepStatus,
    taxResidency,
    riskTolerance,
    investmentHorizon,
    maxDrawdown,
    yearsTrading,
    averageTradesPerMonth,
    strategyStyle,
    preferredLeverage,
  }

  const missing = Object.entries(requiredValues)
    .filter(([, value]) => value === undefined || value === null || String(value).trim() === '')
    .map(([key]) => key)

  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` })
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  if (!['yes', 'no'].includes(String(usCitizen).toLowerCase()) || !['yes', 'no'].includes(String(pepStatus).toLowerCase())) {
    return res.status(400).json({ message: 'Invalid compliance options selected' })
  }

  const normalizeMulti = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean).join(',')
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(',')
  }

  const normalizedProductsTraded = normalizeMulti(productsTraded)
  const normalizedPreferredMarkets = normalizeMulti(preferredMarkets)

  if (!normalizedProductsTraded || !normalizedPreferredMarkets) {
    return res.status(400).json({ message: 'Products traded and preferred markets are required' })
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  if (existing.length) return res.status(409).json({ message: 'Email already in use' })

  const passwordHash = await bcrypt.hash(password, 12)

  const [result] = await pool.query(
    `INSERT INTO users (
      username,email,password_hash,role,first_name,last_name,phone,country,date_of_birth,
      annual_income,net_worth,employment_status,source_of_funds,us_citizen,pep_status,tax_residency,
      risk_tolerance,investment_horizon,max_drawdown,years_trading,products_traded,
      average_trades_per_month,preferred_markets,strategy_style,preferred_leverage,balance
    ) VALUES (?, ?, ?, 'client', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      username,
      email,
      passwordHash,
      firstName || null,
      lastName || null,
      phone || null,
      country || null,
      dateOfBirth || null,
      annualIncome || null,
      netWorth || null,
      employmentStatus || null,
      sourceOfFunds || null,
      usCitizen || null,
      pepStatus || null,
      taxResidency || null,
      riskTolerance || null,
      investmentHorizon || null,
      maxDrawdown || null,
      yearsTrading || null,
      normalizedProductsTraded,
      averageTradesPerMonth || null,
      normalizedPreferredMarkets,
      strategyStyle || null,
      preferredLeverage || null,
    ],
  )

  const [rows] = await pool.query('SELECT id, username, email, role, country, risk_tolerance AS riskTolerance FROM users WHERE id = ?', [result.insertId])
  const user = rows[0]
  const token = signToken(user)
  await logActivity(user.id, `New account opened by ${user.email}`)

  return res.status(201).json({ token, user })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
  const user = rows[0]

  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' })

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    country: user.country,
    riskTolerance: user.risk_tolerance,
  }
  const token = signToken(payload)
  await logActivity(user.id, `${user.email} logged in`)

  return res.json({ token, user: payload })
})

router.get('/me', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT id, username, email, role, country, risk_tolerance AS riskTolerance FROM users WHERE id = ? LIMIT 1', [req.user.id])
  if (!rows.length) return res.status(404).json({ message: 'User not found' })
  return res.json({ user: rows[0] })
})

export default router
