"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { verifyEmailAction, resendOTPAction } from "@/lib/actions/auth.actions"
import { toast } from "sonner"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const router = useRouter()

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail")
    if (!storedEmail) {
      router.push("/signup")
      return
    }
    setEmail(storedEmail)
  }, [router])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return // numbers only

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last digit
    setOtp(newOtp)

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleVerify() {
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      toast.error("Enter the complete 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const result = await verifyEmailAction({ email, otp: otpString })

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success("Email verified!")

      // Sign in automatically after verification
      // Store password temporarily isn't possible — redirect to login
      router.push("/login?verified=true")

    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend) return
    setResending(true)

    try {
      const result = await resendOTPAction({ email })
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("New OTP sent to your email")
      setCountdown(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Check your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We sent a 6-digit OTP to
          </p>
          <p className="text-sm font-medium text-black dark:text-white mt-1">
            {email}
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-bold border-2 dark:border-neutral-700 rounded-lg outline-none focus:border-black dark:focus:border-white bg-white dark:bg-neutral-800 dark:text-white transition-colors"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the email?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-black dark:text-white font-medium hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <span className="text-gray-400">
                Resend in {countdown}s
              </span>
            )}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/signup" className="hover:underline">
            ← Back to signup
          </Link>
        </p>

      </div>
    </div>
  )
}