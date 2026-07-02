"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { ShoppingBag, Package, LogOut, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

  const navLinks = [
    ...(isSeller
      ? [{ href: "/dashboard/seller", label: "Products", icon: Package, match: (p) => p.startsWith("/dashboard/seller") }]
      : []),
    { href: "/dashboard/purchases", label: "Purchases", icon: ShoppingBag, match: (p) => p === "/dashboard/purchases" },
  ]

  return (
    <header className="border-b bg-white dark:bg-neutral-900 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">

        {/* Left — Logo + Nav links */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-black dark:text-white shrink-0"
          >
            GateDrop
          </Link>

          <nav className="flex items-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  link.match(pathname)
                    ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right — Theme toggle + User menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 sm:gap-1.5 outline-none group">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-1 py-1">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {user?.role}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
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