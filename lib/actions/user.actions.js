"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

  return { success: true, redirectTo: role === "SELLER" ? "/dashboard/seller" : "/dashboard/purchases" }
}