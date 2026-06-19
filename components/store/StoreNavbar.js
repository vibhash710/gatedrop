import Link from "next/link"
import { auth } from "@/lib/auth"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function StoreNavbar() {
  const session = await auth()

  function getInitials(name) {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header className="border-b bg-white dark:bg-neutral-900 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left — Logo + Browse */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-black dark:text-white"
          >
            GateDrop
          </Link>
          <Link
            href="/products"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            Browse
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={session.user?.image} />
                <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                  {getInitials(session.user?.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}