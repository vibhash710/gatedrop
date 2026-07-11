"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { resetPasswordAction } from "@/lib/actions/auth.actions"
import { toast } from "sonner"
import Link from "next/link"
import { Eye, EyeOff, KeyRound } from "lucide-react"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const params = useParams()
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const password = formData.get("password")
    const confirm = formData.get("confirm")

    if (password !== confirm) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const result = await resetPasswordAction({
        token: params.token,
        password,
      })

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success("Password reset successfully!")
      router.push("/login?reset=true")

    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                className="w-full border dark:border-neutral-700 rounded-md px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirm"
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                className="w-full border dark:border-neutral-700 rounded-md px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          <Link href="/login" className="text-black dark:text-white font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}