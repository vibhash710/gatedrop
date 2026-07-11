"use client"

import { useState } from "react"
import { forgotPasswordAction } from "@/lib/actions/auth.actions"
import { toast } from "sonner"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const emailValue = formData.get("email").toLowerCase().trim()
    setEmail(emailValue)

    try {
      const result = await forgotPasswordAction({ email: emailValue })

      if (result?.error) {
        toast.error(result.error)
        return
      }

      setSent(true)

    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow w-full max-w-md text-center">
          <div className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Check your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            If an account exists for
          </p>
          <p className="text-sm font-medium text-black dark:text-white mb-4">
            {email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            you will receive a password reset link shortly.
            The link expires in 1 hour.
          </p>
          <Link
            href="/login"
            className="text-sm text-black dark:text-white font-medium hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block font-bold text-xl text-black dark:text-white mb-4">
            GateDrop
          </Link>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Forgot password?
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          <Link
            href="/login"
            className="text-black dark:text-white font-medium hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}