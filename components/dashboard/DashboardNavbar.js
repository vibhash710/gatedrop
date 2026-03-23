"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { ShoppingBag, Package, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import ThemeToggle from "@/components/ThemeToggle"

export default function DashboardNavbar({ user }) {
  const pathname = usePathname()

  const isSeller = user?.role === "SELLER"

  function getInitials(name) {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="border-b bg-white dark:bg-neutral-900 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left — Logo + Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-black dark:text-white"
          >
            GateDrop
          </Link>

          <nav className="flex items-center gap-1">
            {isSeller && (
              <Link
                href="/dashboard/seller"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard/seller")
                    ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Package className="w-4 h-4" />
                Products
              </Link>
            )}

            <Link
              href="/dashboard/purchases"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === "/dashboard/purchases"
                  ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Purchases
            </Link>
          </nav>
        </div>

        {/* Right — Theme toggle + User menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* User info */}
              <div className="px-2 py-2">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-1 text-xs capitalize"
                >
                  {user?.role?.toLowerCase()}
                </Badge>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}