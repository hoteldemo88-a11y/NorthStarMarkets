import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { signToken } from '../utils/tokens.js'
import { logActivity } from '../utils/activity.js'

const router = Router()

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

const commodityTicketMap = {
  gold: 'XAUUSD',
  silver: 'XAGUSD',
  'crude oil': 'USOIL',
  'natural gas': 'NATGAS',
  coffee: 'COFFEE',
  wheat: 'WHEAT',
  'soy beans': 'SOYBEAN',
  'orange juice': 'OJUSD',
  'us dollar': 'DXY',
}

router.post('/login', async (req, res) => {
  const normalizedEmail = String(req.body.email || '').trim().toLowerCase()
  const password = req.body.password

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? AND role = "admin" LIMIT 1', [normalizedEmail])
  const admin = rows[0]

  if (!admin) return res.status(401).json({ message: 'Invalid admin credentials' })
  const valid = await bcrypt.compare(password, admin.password_hash)
  if (!valid) return res.status(401).json({ message: 'Invalid admin credentials' })

  const user = { id: admin.id, email: admin.email, username: admin.username, role: admin.role }
  const token = signToken(user)
  await logActivity(admin.id, `Admin ${admin.email} logged in`)
  return res.json({ token, user })
})

router.use(authenticate, requireAdmin)

router.get('/users', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, username, email, role, balance, country FROM users WHERE role = "client" ORDER BY id DESC')
  return res.json(rows)
})

router.patch('/users/:id/balance', async (req, res) => {
  const userId = Number(req.params.id)
  const delta = Number(req.body.delta || 0)

  if (!Number.isFinite(delta) || delta === 0) {
    return res.status(400).json({ message: 'Valid balance delta required' })
  }

  const [[client]] = await pool.query('SELECT id FROM users WHERE id = ? AND role = "client" LIMIT 1', [userId])
  if (!client) {
    return res.status(404).json({ message: 'Client not found' })
  }

  await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [delta, userId])
  await logActivity(req.user.id, `Adjusted user(${userId}) balance by ${delta}`)
  return res.json({ message: 'Balance updated' })
})

router.post('/trades', async (req, res) => {
  const { userId, userEmail, symbol, side = 'buy', volume, pnl = 0, status = 'open', tradeDate, contractExpiry, entryPrice } = req.body

  let targetUserId = Number(userId) || null

  if (!targetUserId && userEmail) {
    const [[user]] = await pool.query('SELECT id FROM users WHERE email = ? AND role = "client" LIMIT 1', [userEmail])
    if (!user) return res.status(404).json({ message: 'Client email not found' })
    targetUserId = user.id
  }

  if (targetUserId) {
    const [[client]] = await pool.query('SELECT id FROM users WHERE id = ? AND role = "client" LIMIT 1', [targetUserId])
    if (!client) return res.status(404).json({ message: 'Client not found' })
  }

  if (!targetUserId || !symbol || !side || !volume) {
    return res.status(400).json({ message: 'userEmail (or userId), symbol, side, and volume are required' })
  }

  const normalizedSymbol = String(symbol).trim().toLowerCase()
  if (!allowedCommodities.includes(normalizedSymbol)) {
    return res.status(400).json({ message: 'Invalid commodity selected' })
  }

  if (!contractExpiry) {
    return res.status(400).json({ message: 'Contract expiry date is required' })
  }

  const ticketSymbol = commodityTicketMap[normalizedSymbol] || normalizedSymbol.toUpperCase()
  const parsedVolume = Number(volume)
  const parsedPnl = Number(pnl || 0)
  const parsedEntryPrice = entryPrice !== undefined && entryPrice !== null && String(entryPrice) !== '' ? Number(entryPrice) : null

  if (!Number.isFinite(parsedVolume) || parsedVolume <= 0) {
    return res.status(400).json({ message: 'Investment amount must be positive' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await connection.query(
      'INSERT INTO trades (user_id, symbol, ticket_symbol, side, volume, margin_held, pnl, status, trade_date, contract_expiry, entry_price) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)',
      [targetUserId, normalizedSymbol.toUpperCase(), ticketSymbol, side, parsedVolume, parsedPnl, status, tradeDate || null, contractExpiry, parsedEntryPrice],
    )

    if (status === 'closed') {
      await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [parsedPnl, targetUserId])
    }

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }

  await logActivity(req.user.id, `Trade created for user(${targetUserId}): ${normalizedSymbol} ${side}`)
  return res.status(201).json({ message: 'Trade created' })
})

router.patch('/trades/:id/close', async (req, res) => {
  const tradeId = Number(req.params.id)
  const closePnl = Number(req.body.pnl)
  const parsedExitPrice = req.body.exitPrice !== undefined && req.body.exitPrice !== null && String(req.body.exitPrice) !== '' ? Number(req.body.exitPrice) : null

  if (!Number.isFinite(closePnl)) {
    return res.status(400).json({ message: 'Valid pnl value is required' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [[trade]] = await connection.query('SELECT id, user_id, status, margin_held FROM trades WHERE id = ? LIMIT 1 FOR UPDATE', [tradeId])
    if (!trade) {
      await connection.rollback()
      return res.status(404).json({ message: 'Trade not found' })
    }

    if (trade.status !== 'open') {
      await connection.rollback()
      return res.status(400).json({ message: 'Trade is already closed' })
    }

    await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [closePnl, trade.user_id])
    await connection.query('UPDATE trades SET status = "closed", pnl = ?, margin_held = 0, exit_price = ? WHERE id = ?', [closePnl, parsedExitPrice, tradeId])

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }

  await logActivity(req.user.id, `Trade(${tradeId}) closed with pnl ${closePnl}`)
  return res.json({ message: 'Trade closed and settled' })
})

router.get('/trades', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT
      t.id,
      t.user_id AS userId,
      u.email AS userEmail,
      u.username,
      t.symbol,
      t.ticket_symbol AS ticketSymbol,
      t.side,
      t.volume,
      t.margin_held AS marginHeld,
      t.pnl,
      t.entry_price AS entryPrice,
      t.exit_price AS exitPrice,
      t.status,
      t.trade_date AS tradeDate,
      t.contract_expiry AS contractExpiry,
      t.created_at AS createdAt
    FROM trades t
    JOIN users u ON u.id = t.user_id
    ORDER BY t.id DESC`,
  )
  return res.json(rows)
})

router.get('/requests', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, user_id AS userId, type, amount, status, created_at AS createdAt FROM fund_requests ORDER BY id DESC')
  return res.json(rows)
})

router.patch('/requests/:id', async (req, res) => {
  const requestId = Number(req.params.id)
  const { status } = req.body
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  const [[request]] = await pool.query('SELECT * FROM fund_requests WHERE id = ? LIMIT 1', [requestId])
  if (!request) return res.status(404).json({ message: 'Request not found' })

  await pool.query('UPDATE fund_requests SET status = ? WHERE id = ?', [status, requestId])

  if (status === 'approved') {
    if (request.type === 'deposit') {
      await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [request.amount, request.user_id])
    }
    if (request.type === 'withdraw') {
      await pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [request.amount, request.user_id])
    }
  }

  await logActivity(req.user.id, `Request(${requestId}) changed to ${status}`)
  return res.json({ message: 'Request updated' })
})

router.get('/activity-logs', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, user_id AS userId, action, created_at AS createdAt FROM activity_logs ORDER BY id DESC LIMIT 300')
  return res.json(rows)
})

router.get('/notifications', async (req, res) => {
  const since = req.query.since ? new Date(req.query.since) : new Date(0)

  const [pendingRequests] = await pool.query(
    'SELECT COUNT(*) as count FROM fund_requests WHERE status = "pending" AND created_at > ?',
    [since]
  )

  const [newTrades] = await pool.query(
    'SELECT COUNT(*) as count FROM trades WHERE created_at > ?',
    [since]
  )

  return res.json({
    pendingRequests: pendingRequests[0].count,
    newTrades: newTrades[0].count,
  })
})

export default router
