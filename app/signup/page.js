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
            const result = await signUpAction(formData)

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create your account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}