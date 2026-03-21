"use client"

import { useState } from "react"
import { signUpAction } from "@/lib/actions/auth.actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.target)

        try {
            const result = await signUpAction({
                name: formData.get("name"),
                email: formData.get("email").toLowerCase().trim(),
                password: formData.get("password"),
            })

            if (result?.error) {
                setError(result.error)
                return
            }

            router.push("/dashboard")
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
                    Create your account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full border dark:border-neutral-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
                        />
                    </div>

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
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black dark:text-white font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}