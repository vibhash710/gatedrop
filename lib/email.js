import { resend } from "@/lib/resend"

export async function sendVerificationEmail(email, otp) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your GateDrop account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f0f0f; margin-bottom: 8px;">
          Verify your email
        </h1>
        <p style="color: #666; font-size: 15px; margin-bottom: 24px;">
          Enter this OTP to verify your GateDrop account. 
          It expires in 10 minutes.
        </p>
        <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0f0f0f; margin: 0;">
            ${otp}
          </p>
        </div>
        <p style="color: #999; font-size: 13px;">
          If you didn't create a GateDrop account, ignore this email.
        </p>
      </div>
    `,
  })
}