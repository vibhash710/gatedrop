import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronRight, ChevronDown, Package, LayoutGrid } from "lucide-react"
import SignOutButton from "@/components/store/SignOutButton"

export default async function StoreNavbar() {
  const session = await auth()

  function getInitials(name) {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  const navLinks = [
    { href: "/products", label: "Browse Products", icon: Package },
    ...(session ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutGrid }] : []),
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
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground transition-colors"
              >
                <link.icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 sm:gap-1.5 outline-none group">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user?.image} alt={session.user?.name} />
                    <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-1 py-1">
                  <p className="text-sm font-semibold">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user?.email}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {session.user?.role}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <SignOutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="gap-0.5" asChild>
              <Link href="/login">
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

      </div>
    </header>
  )
}