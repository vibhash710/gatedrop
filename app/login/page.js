"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    function getAuthErrorMessage(error) {
        switch (error) {
            case "OAuthAccountNotLinked":
                return "Account already exists. Try signing in with your original method (Google, GitHub, or email/password)."
            case "CredentialsSignin":
                return "Invalid email or password"
            case "AccessDenied":
                return "Access denied. Please try again."
            default:
                return "Something went wrong"
        }
    }

    useEffect(() => {
        const errorParam = searchParams.get("error")

        if (errorParam) {
            setError(getAuthErrorMessage(errorParam))
        }
    }, [searchParams])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.target)

        try {
            const result = await signIn("credentials", {
                email: formData.get("email").toLowerCase().trim(),
                password: formData.get("password"),
                redirect: false,   // handle redirect manually so we can catch errors
            })

            if (result?.error) {
                setError("Invalid credentials. If you signed up with Google or GitHub, try those instead.")
                return
            }

            router.push(callbackUrl)
            router.refresh()

        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
                    Welcome back
                </h1>

                {/* OAuth buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => signIn("google", { callbackUrl })}
                        className="w-full flex items-center justify-center gap-2 border dark:border-neutral-700 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 text-black dark:text-white"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <button
                        onClick={() => signIn("github", { callbackUrl })}
                        className="w-full flex items-center justify-center gap-2 border dark:border-neutral-700 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 text-black dark:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 4.99 3.2 9.23 7.64 10.73.56.1.76-.24.76-.53v-1.85c-3.1.68-3.75-1.49-3.75-1.49-.5-1.27-1.22-1.6-1.22-1.6-.99-.68.07-.67.07-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.67 2.54 1.19 3.16.91.1-.7.38-1.19.7-1.46-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.43-2.21 1.13-2.99-.11-.28-.49-1.4.11-2.92 0 0 .92-.29 3.02 1.14a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.14 3.02-1.14.6 1.52.22 2.64.11 2.92.7.78 1.13 1.77 1.13 2.99 0 4.29-2.6 5.24-5.08 5.52.39.34.73 1.01.73 2.04v3.02c0 .29.2.64.77.53A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Continue with GitHub
                    </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-neutral-700" />
                    </div>
                    <div className="relative flex justify-center text-xs text-gray-500">
                        <span className="bg-white dark:bg-neutral-900 px-2">
                            or continue with email
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full border dark:border-neutral-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full border dark:border-neutral-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-black dark:text-white font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}