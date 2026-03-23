import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardNavbar from "@/components/dashboard/DashboardNavbar"

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <DashboardNavbar user={session.user} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}