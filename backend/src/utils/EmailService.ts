import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
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
      subject: "Your OTP for Signup",
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #6187F0;">Welcome to BodyFirst!</h2>
      <p>Your One-Time Password (OTP) for signup is:</p>
      <div style="margin: 20px 0; font-size: 24px; font-weight: bold; color: #333;">
        ${otp}
      </div>
      <p style="color: #555;">This OTP is valid for <strong>5 minutes</strong>.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #888;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
  `,
    });

  } catch (error) {
   
    throw new Error("Failed to send OTP");
  }
}