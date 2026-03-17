import { Router } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { sendPasswordResetEmail } from '../config/email.js'
import { logActivity } from '../utils/activity.js'

const router = Router()

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    console.log('Forgot password request for:', email)

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const [[user]] = await pool.query(
      'SELECT id, email FROM users WHERE email = ? LIMIT 1',
      [email]
    )
    console.log('User found:', user)

    if (!user) {
      return res.status(404).json({ message: 'This email does not exist in our database' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    console.log('Inserting token...')

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    )
    console.log('Token inserted, sending email...')

    try {
      await sendPasswordResetEmail(user.email, token)
      console.log('Email sent')
    } catch (emailError) {
      console.error('Email send error:', emailError.message)
      return res.status(500).json({ message: 'Failed to send email: ' + emailError.message })
    }

    await logActivity(user.id, 'Password reset requested')

    return res.status(200).json({ message: 'Password reset link sent to your email' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({ error: error.message, stack: error.stack })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Token and passwords are required' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const [[resetToken]] = await pool.query(
      'SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = ? LIMIT 1',
      [token]
    )

    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid reset token' })
    }

    if (resetToken.used) {
      return res.status(400).json({ message: 'This reset token has already been used' })
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Reset token has expired' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      await connection.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [passwordHash, resetToken.user_id]
      )

      await connection.query(
        'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
        [resetToken.id]
      )

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }

    await logActivity(resetToken.user_id, 'Password reset successfully')

    return res.status(200).json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ message: 'Failed to reset password' })
  }
})

router.get('/verify-token/:token', async (req, res) => {
  try {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({ valid: false, message: 'Token is required' })
    }

    const [[resetToken]] = await pool.query(
      'SELECT id, expires_at, used FROM password_reset_tokens WHERE token = ? LIMIT 1',
      [token]
    )

    if (!resetToken) {
      return res.status(400).json({ valid: false, message: 'Invalid reset token' })
    }

    if (resetToken.used) {
      return res.status(400).json({ valid: false, message: 'This reset token has already been used' })
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Reset token has expired' })
    }

    return res.status(200).json({ valid: true })
  } catch (error) {
    console.error('Verify token error:', error)
    return res.status(500).json({ valid: false, message: 'Failed to verify token' })
  }
})

export default router
