import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const path = req.nextUrl.pathname
  const user = req.auth?.user
  const hasRole = !!user?.role

  const isOnDashboard = path.startsWith("/dashboard")
  const isOnOnboarding = path === "/onboarding"

  if (isOnDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    // redirect back after login
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoggedIn && !hasRole && !isOnOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  if (isLoggedIn && hasRole && isOnOnboarding) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
}