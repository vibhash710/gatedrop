"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { createOTP, verifyOTP } from "@/lib/otp"
import { sendVerificationEmail } from "@/lib/email"
import { sendPasswordResetEmail } from "@/lib/email"
import { headers } from "next/headers"
import { rateLimits } from "@/lib/ratelimit"

async function getIP() {
  const headersList = await headers()
  return (
    headersList.get("x-real-ip") ??
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    "127.0.0.1"
  )
}

export async function signUpAction({ name, email, password }) {

  // Rate limit signup
  const ip = await getIP()
  const { success } = await rateLimits.auth.limit(`signup:${ip}`)
  if (!success) return { error: "Too many attempts. Try again later." }

  // Basic validation
  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser && existingUser.emailVerified) {
      return { error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Upsert — update if exists (unverified), create if not
    await prisma.user.upsert({
      where: { email },
      update: { name, password: hashedPassword },
      create: { name, email, password: hashedPassword },
    })

    // Generate and send OTP
    const otp = await createOTP(email)
    await sendVerificationEmail(email, otp)

    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: "Something went wrong" }
  }
}

export async function verifyEmailAction({ email, otp }) {

  const ip = await getIP()
  const { success } = await rateLimits.auth.limit(`verify:${ip}`)
  if (!success) return { error: "Too many attempts. Try again later." }

  try {
    const result = await verifyOTP(email, otp)

    if (result.error) return { error: result.error }

    // Mark email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: "Something went wrong" }
  }
}

export async function resendOTPAction({ email }) {

  const ip = await getIP()
  const { success } = await rateLimits.email.limit(`resend:${email}`)
  if (!success) return { error: "Too many attempts. Try again later." }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) return { error: "User not found" }
    if (user.emailVerified) return { error: "Email already verified" }

    const otp = await createOTP(email)
    await sendVerificationEmail(email, otp)

    return { success: true }

  } catch (error) {
    return { error: "Something went wrong" }
  }
}

export async function forgotPasswordAction({ email }) {

  // Rate limit by both IP and email
  const ip = await getIP()
  const { success: ipOk } = await rateLimits.email.limit(`forgot:${ip}`)
  const { success: emailOk } = await rateLimits.email.limit(`forgot:${email}`)
  if (!ipOk || !emailOk) {
    return { error: "Too many attempts. Try again in an hour." }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // Always return success even if user not found
    // prevents email enumeration attacks
    if (!user || !user.password) {
      return { success: true }
    }

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`
    await sendPasswordResetEmail(email, resetUrl)

    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: "Something went wrong" }
  }
}

export async function resetPasswordAction({ token, password }) {

  const ip = await getIP()
  const { success } = await rateLimits.auth.limit(`reset:${ip}`)
  if (!success) return { error: "Too many attempts. Try again later." }

  try {
    if (!password || password.length < 6) {
      return { error: "Password must be at least 6 characters" }
    }

    // Find token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) return { error: "Invalid or expired reset link" }
    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } })
      return { error: "Reset link has expired. Request a new one." }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    // Delete used token
    await prisma.passwordResetToken.delete({ where: { token } })

    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: "Something went wrong" }
  }
}