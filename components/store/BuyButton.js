"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BuyButton({ productId, alreadyPurchased, isLoggedIn }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Already purchased — show download button
  if (alreadyPurchased) {
    return (
      <Button
        className="w-full"
        onClick={() => router.push(`/api/download/${productId}`)}
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    )
  }

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${productId}`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Something went wrong")
        return
      }

      // Redirect to Stripe checkout
      window.location.href = data.url

    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleBuy}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 mr-2" />
          Buy Now
        </>
      )}
    </Button>
  )
}