import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

export async function GET(req, { params }) {
  try {
    const session = await auth()

    // Must be logged in
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { productId } = await params

    // Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Allow seller to download their own product
    const isSeller = product.sellerId === session.user.id

    if (!isSeller) {
      // Check if user purchased this product
      const purchase = await prisma.purchase.findFirst({
        where: {
          userId: session.user.id,
          productId,
        },
      })

      if (!purchase) {
        return NextResponse.json(
          { error: "You have not purchased this product" },
          { status: 403 }
        )
      }
    }

    // Generate signed URL — expires in 60 seconds
    const signedUrl = await utapi.generateSignedURL(product.fileKey, {
      expiresIn: 60,
    })

    const downloadUrl = signedUrl.ufsUrl || signedUrl.url

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Failed to generate download URL" },
        { status: 500 }
      )
    }

    // Redirect to signed URL
    return NextResponse.redirect(downloadUrl)

  } catch (err) {
    console.error("Download error:", err)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}