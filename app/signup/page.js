"use client"

import { useState } from "react"
import { signUpAction } from "@/lib/actions/auth.actions"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserPlus, Eye, EyeOff, User, Mail, Lock} from "lucide-react"

export default function SignupPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        const email = formData.get("email").toLowerCase().trim()
        const password = formData.get("password")

        try {
            const result = await signUpAction({
                name: formData.get("name"),
                email,
                password
            })

            if (result?.error) {
                toast.error(result.error)
                return
            }

            const login = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (login?.error) {
                toast.error("Account created but login failed")
                return
            }

            router.push("/dashboard")
            router.refresh()

        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-black dark:text-white">
                        Create your GateDrop account
                    </h1>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Start buying or selling digital products today.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full border dark:border-neutral-700 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full border dark:border-neutral-700 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full border dark:border-neutral-700 rounded-md pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
                                placeholder="Create a strong password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        {loading ? "Creating account..." : "Create account"}
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