import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { rateLimits } from "@/lib/ratelimit"
import { getIdentifier } from "@/lib/getRateLimitIdentifier"

export async function POST(req) {
  const identifier = await getIdentifier()
  const { success } = await rateLimits.api.limit(identifier)

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }
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

    // Verify signature
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

    // Get product price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { price: true, sellerId: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Get commission config
    const config = await prisma.platformConfig.findFirst()
    const commissionPercent = config?.commissionPercent ?? 10

    // Calculate amounts
    const amount = product.price
    const platformFee = parseFloat(
      ((amount * commissionPercent) / 100).toFixed(2)
    )
    const sellerEarnings = parseFloat((amount - platformFee).toFixed(2))

    // Check duplicate
    const existing = await prisma.purchase.findUnique({
      where: { paymentId: razorpay_payment_id },
    })

    if (!existing) {
      await prisma.purchase.create({
        data: {
          userId: session.user.id,
          productId,
          sellerId: product.sellerId,
          paymentId: razorpay_payment_id,
          amount,
          platformFee,
          sellerEarnings,
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