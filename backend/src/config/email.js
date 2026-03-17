import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'North Star Markets <mailer@northstarmarketsint.com>',
    to: email,
    subject: 'Password Reset - North Star Markets',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background-color: #1a1a2e; color: #ffffff; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">North Star Markets</h1>
            <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.8;">Password Reset Request</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">Hello,</p>
            <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #e6b800; color: #1a1a2e; padding: 14px 35px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">Reset Password</a>
            </div>
            <p style="color: #888888; font-size: 12px; margin: 20px 0 0;">This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
            <p style="color: #888888; font-size: 12px; margin: 10px 0 0;">Or copy this link to your browser:</p>
            <p style="color: #0066cc; font-size: 12px; word-break: break-all;">${resetUrl}</p>
          </div>
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
            <p style="color: #999999; font-size: 11px; margin: 0;">© 2024 North Star Markets. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello,\n\nWe received a request to reset your password. Click the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour. If you didn't request a password reset, please ignore this email.\n\n© 2024 North Star Markets`,
  }

  return transporter.sendMail(mailOptions)
}

export default transporter
