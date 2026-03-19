import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url)

    // redirect back after login
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
}