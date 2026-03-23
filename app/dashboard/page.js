import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (session?.user?.role === "SELLER") {
    redirect("/dashboard/seller")
  }

  redirect("/dashboard/purchases")
}