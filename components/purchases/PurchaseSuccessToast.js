"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export default function PurchaseSuccessToast() {
  useEffect(() => {
    toast.success("Purchase successful! Your file is ready to download.")
  }, [])

  return null
}