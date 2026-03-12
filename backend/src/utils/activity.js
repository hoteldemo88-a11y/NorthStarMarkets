import pool from '../config/db.js'

export async function logActivity(userId, action) {
  await pool.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [userId || null, action])
}
