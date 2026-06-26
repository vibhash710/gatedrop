"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function BuyButton({ productId, alreadyPurchased, isLoggedIn, userEmail, userName }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (alreadyPurchased) {
    return (
      <Button
        className="w-full"
        asChild
      >
        <a href={`/api/download/${productId}`}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </a>
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
      // Step 1 — create order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      // Step 2 — load Razorpay script
      const loaded = await loadRazorpayScript()

      if (!loaded) {
        toast.error("Failed to load payment. Check your connection.")
        setLoading(false)
        return
      }

      // Step 3 — check Razorpay available
      if (!window.Razorpay) {
        toast.error("Razorpay unavailable")
        setLoading(false)
        return
      }

      // Step 4 — open popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "GateDrop",
        description: data.productTitle,
        order_id: data.orderId,
        prefill: {
          email: userEmail || "",
          name: userName || "",
        },
        theme: {
          color: "#000000",
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              toast.error(verifyData.error || "Payment verification failed")
              return
            }

            toast.success("Payment successful!")
            router.push("/dashboard/purchases?success=true")
            router.refresh()

          } catch (err) {
            toast.error("Payment verification failed")
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", function () {
        toast.error("Payment failed. Please try again.")
        setLoading(false)
      })

      setLoading(false)  // stop spinner before popup opens
      rzp.open()

    } catch (err) {
      toast.error("Something went wrong")
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
          Loading...
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