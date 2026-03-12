import pool from '../config/db.js'

export async function closeExpiredTrades() {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [expiredTrades] = await connection.query(
      `SELECT id, user_id, margin_held, pnl
       FROM trades
       WHERE status = 'open'
         AND contract_expiry IS NOT NULL
         AND contract_expiry <= CURDATE()`,
    )

    for (const trade of expiredTrades) {
      await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [Number(trade.pnl || 0), trade.user_id])
      await connection.query('UPDATE trades SET status = "closed", margin_held = 0 WHERE id = ?', [trade.id])
    }

    await connection.commit()
    return expiredTrades.length
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
