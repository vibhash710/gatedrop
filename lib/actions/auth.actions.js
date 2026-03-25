"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

        if (existingUser) {
            return { error: "Email already in use" }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return { success: true }

    } catch (error) {
        console.error(error)
        return { error: "Something went wrong" }
    }
}