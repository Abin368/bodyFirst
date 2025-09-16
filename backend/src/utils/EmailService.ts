import nodemailer from 'nodemailer'
import fs from 'fs/promises'

export const sendOtpEmail = async (email: string, otp: string, type: 'signup' | 'forget') => {
  try {
    const templatePath = `src/templates/emails/${type}.html`
    let html = await fs.readFile(templatePath, 'utf-8')

    html = html.replace('{{otp}}', otp)

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"BodyFirst" <${process.env.SMTP_USER}>`,
      to: email,
      subject: type === 'signup' ? 'Your OTP for Signup' : 'Your OTP for Password Reset',
      html,
    })
  } catch {
    throw new Error('Failed to send OTP')
  }
}
