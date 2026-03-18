"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/lib/auth"

export async function signUpAction(formData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")

  // Basic validation
  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

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
      role: "BUYER",
    },
  })

  // Auto sign in after signup
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  })
}