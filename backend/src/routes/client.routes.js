import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { authenticate } from '../middleware/auth.js'
import { logActivity } from '../utils/activity.js'

const router = Router()
router.use(authenticate)

const allowedCommodities = [
  'gold',
  'silver',
  'crude oil',
  'natural gas',
  'coffee',
  'wheat',
  'soy beans',
  'orange juice',
  'us dollar',
]

router.get('/summary', async (req, res) => {
  const userId = req.user.id
  const [users] = await pool.query('SELECT id, username, email, balance, phone, country, risk_tolerance AS riskTolerance FROM users WHERE id = ? LIMIT 1', [userId])
  if (!users.length) return res.status(404).json({ message: 'User not found' })

  const [openTrades] = await pool.query('SELECT id, symbol, ticket_symbol AS ticketSymbol, side, volume, margin_held AS marginHeld, pnl, trade_date AS tradeDate, contract_expiry AS contractExpiry FROM trades WHERE user_id = ? AND status = "open" ORDER BY id DESC LIMIT 20', [userId])
  const [tradeHistory] = await pool.query('SELECT id, symbol, ticket_symbol AS ticketSymbol, side, volume, margin_held AS marginHeld, pnl, trade_date AS tradeDate, contract_expiry AS contractExpiry FROM trades WHERE user_id = ? AND status = "closed" ORDER BY id DESC LIMIT 20', [userId])
  const [depositRequests] = await pool.query('SELECT id, amount, status FROM fund_requests WHERE user_id = ? AND type = "deposit" ORDER BY id DESC LIMIT 20', [userId])
  const [withdrawRequests] = await pool.query('SELECT id, amount, status FROM fund_requests WHERE user_id = ? AND type = "withdraw" ORDER BY id DESC LIMIT 20', [userId])

  const openPnl = openTrades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0)

  return res.json({
    balance: users[0].balance,
    equity: Number(users[0].balance) + openPnl,
    profile: users[0],
    openTrades,
    tradeHistory,
    depositRequests,
    withdrawRequests,
  })
})

router.post('/deposits', async (req, res) => {
  const { amount } = req.body
  if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'Amount must be positive' })

  await pool.query('INSERT INTO fund_requests (user_id, type, amount, status) VALUES (?, "deposit", ?, "pending")', [req.user.id, amount])
  await logActivity(req.user.id, `Deposit request submitted: $${amount}`)
  return res.status(201).json({ message: 'Deposit request submitted' })
})

router.post('/withdrawals', async (req, res) => {
  const { amount } = req.body
  if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'Amount must be positive' })

  await pool.query('INSERT INTO fund_requests (user_id, type, amount, status) VALUES (?, "withdraw", ?, "pending")', [req.user.id, amount])
  await logActivity(req.user.id, `Withdrawal request submitted: $${amount}`)
  return res.status(201).json({ message: 'Withdrawal request submitted' })
})

router.post('/trades', async (req, res) => {
  const { commodity, amount, tradeDate } = req.body

  if (!commodity || !amount || !tradeDate) {
    return res.status(400).json({ message: 'Commodity, amount, and date are required' })
  }

  const normalizedCommodity = String(commodity).trim().toLowerCase()
  if (!allowedCommodities.includes(normalizedCommodity)) {
    return res.status(400).json({ message: 'Invalid commodity selected' })
  }

  const parsedAmount = Number(amount)
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be positive' })
  }

  await pool.query(
    'INSERT INTO trades (user_id, symbol, side, volume, pnl, status, trade_date) VALUES (?, ?, "buy", ?, 0, "open", ?)',
    [req.user.id, normalizedCommodity.toUpperCase(), parsedAmount, tradeDate],
  )
  await logActivity(req.user.id, `Client trade created: ${normalizedCommodity} amount ${parsedAmount}`)
  return res.status(201).json({ message: 'Trade request created' })
})

router.put('/profile', async (req, res) => {
  const { username, country, riskTolerance, phone } = req.body

  if (!username) {
    return res.status(400).json({ message: 'Username is required' })
  }

  await pool.query(
    'UPDATE users SET username = ?, country = ?, risk_tolerance = ?, phone = ? WHERE id = ?',
    [username, country || null, riskTolerance || null, phone || null, req.user.id],
  )
  await logActivity(req.user.id, 'Profile settings updated')
  return res.json({ message: 'Profile updated' })
})

router.put('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' })
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' })
  }

  const [[user]] = await pool.query('SELECT id, password_hash FROM users WHERE id = ? LIMIT 1', [req.user.id])
  if (!user) return res.status(404).json({ message: 'User not found' })

  const isValid = await bcrypt.compare(currentPassword, user.password_hash)
  if (!isValid) return res.status(401).json({ message: 'Current password is incorrect' })

  const newHash = await bcrypt.hash(newPassword, 12)
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id])
  await logActivity(req.user.id, 'Password changed from dashboard')

  return res.json({ message: 'Password updated successfully' })
})

router.get('/notifications', async (req, res) => {
  const userId = req.user.id
  const since = req.query.since ? new Date(req.query.since) : new Date(0)

  const [newTrades] = await pool.query(
    'SELECT COUNT(*) as count FROM trades WHERE user_id = ? AND created_at > ?',
    [userId, since]
  )

  const [newDepositRequests] = await pool.query(
    'SELECT COUNT(*) as count FROM fund_requests WHERE user_id = ? AND type = "deposit" AND created_at > ?',
    [userId, since]
  )

  const [newWithdrawRequests] = await pool.query(
    'SELECT COUNT(*) as count FROM fund_requests WHERE user_id = ? AND type = "withdraw" AND created_at > ?',
    [userId, since]
  )

  const [openTrades] = await pool.query(
    'SELECT COUNT(*) as count FROM trades WHERE user_id = ? AND status = "open"',
    [userId]
  )

  const [pendingDeposits] = await pool.query(
    'SELECT COUNT(*) as count FROM fund_requests WHERE user_id = ? AND type = "deposit" AND status = "pending"',
    [userId]
  )

  const [pendingWithdrawals] = await pool.query(
    'SELECT COUNT(*) as count FROM fund_requests WHERE user_id = ? AND type = "withdraw" AND status = "pending"',
    [userId]
  )

  return res.json({
    newTrades: newTrades[0].count,
    newDepositRequests: newDepositRequests[0].count,
    newWithdrawRequests: newWithdrawRequests[0].count,
    openTrades: openTrades[0].count,
    pendingDeposits: pendingDeposits[0].count,
    pendingWithdrawals: pendingWithdrawals[0].count,
  })
})

export default router
