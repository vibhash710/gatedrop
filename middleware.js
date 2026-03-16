import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const path = req.nextUrl.pathname
    
  const isOnDashboard = path.startsWith("/dashboard")

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
}