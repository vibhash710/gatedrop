import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import DashboardFooter from "@/components/dashboard/DashboardFooter"

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
      <DashboardNavbar user={session.user} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>
      <DashboardFooter />
    </div>
  )
}