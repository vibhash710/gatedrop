"use client"

import { signOut } from "next-auth/react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

export default function SignOutButton() {
  return (
    <DropdownMenuItem
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign out
    </DropdownMenuItem>
  )
}