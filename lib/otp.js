import { prisma } from "@/lib/prisma"

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createOTP(email) {
  // Delete any existing OTPs for this email
  await prisma.verificationToken.deleteMany({
    where: { email },
  })

  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.verificationToken.create({
    data: { email, otp, expiresAt },
  })

  return otp
}

export async function verifyOTP(email, otp) {
  const token = await prisma.verificationToken.findFirst({
    where: { email, otp },
  })

  if (!token) return { error: "Invalid OTP" }
  if (token.expiresAt < new Date()) return { error: "OTP expired" }

  // Delete used OTP
  await prisma.verificationToken.deleteMany({
    where: { email },
  })

  return { success: true }
}