import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
    } = await req.json()

    // Verify signature — this proves payment came from Razorpay
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Check if purchase already exists (prevent duplicates)
    const existing = await prisma.purchase.findUnique({
      where: { paymentId: razorpay_payment_id },
    })

    if (!existing) {
      await prisma.purchase.create({
        data: {
          userId: session.user.id,
          productId,
          paymentId: razorpay_payment_id, // reusing field for payment ID
        },
      })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Payment verification error:", err)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}