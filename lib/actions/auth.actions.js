"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { createOTP } from "@/lib/otp"
import { sendVerificationEmail } from "@/lib/email"

export async function signUpAction({ name, email, password }) {
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