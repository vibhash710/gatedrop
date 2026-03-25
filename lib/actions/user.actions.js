"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function selectRoleAction(role) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  if (role !== "BUYER" && role !== "SELLER") {
    return { error: "Invalid role" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  })

  // redirect based on chosen role
  if (role === "SELLER") {
    redirect("/dashboard/seller")
  } else {
    redirect("/dashboard/purchases")
  }
}