import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getRazorpay } from "@/lib/razorpay"

export async function POST(req) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId, published: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    if (product.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot buy your own product" },
        { status: 400 }
      )
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId: session.user.id, productId },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: "Already purchased" },
        { status: 400 }
      )
    }

    const razorpay = getRazorpay()
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(product.price * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        productId: product.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      productTitle: product.title,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })

  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}