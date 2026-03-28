"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product.validation"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

// Helper — verify seller owns the product
async function verifyProductOwner(productId, userId) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    })
    if (!product || product.sellerId !== userId) return null
    return product
}

export async function createProductAction(data) {
    const session = await auth()

    if (!session?.user?.id) return { error: "Not authenticated" }
    if (session.user.role !== "SELLER") return { error: "Not a seller" }

    const validated = productSchema.safeParse(data)
    if (!validated.success) {
        return { error: validated.error.errors[0].message }
    }

    const { title, description, price, coverImageUrl, fileKey } = validated.data

    await prisma.product.create({
        data: {
            title,
            description,
            price: parseFloat(price),
            coverImageUrl,
            fileKey,
            sellerId: session.user.id,
        },
    })

    revalidatePath("/dashboard/seller")
    revalidatePath("/products")
    redirect("/dashboard/seller")
}

export async function updateProductAction(productId, data) {
    const session = await auth()

    if (!session?.user?.id) return { error: "Not authenticated" }
    if (session.user.role !== "SELLER") return { error: "Not a seller" }

    const product = await verifyProductOwner(productId, session.user.id)
    if (!product) return { error: "Product not found" }

    const validated = productSchema.safeParse(data)
    if (!validated.success) {
        return { error: validated.error.errors[0].message }
    }

    const { title, description, price, coverImageUrl, fileKey } = validated.data

    await prisma.product.update({
        where: { id: productId },
        data: {
            title,
            description,
            price: parseFloat(price),
            coverImageUrl,
            fileKey,
        },
    })

    revalidatePath("/dashboard/seller")
    revalidatePath(`/products/${productId}`)
    redirect("/dashboard/seller")
}

export async function togglePublishAction(productId) {
    const session = await auth()

    if (!session?.user?.id) return { error: "Not authenticated" }

    const product = await verifyProductOwner(productId, session.user.id)
    if (!product) return { error: "Product not found" }

    await prisma.product.update({
        where: { id: productId },
        data: { published: !product.published },
    })

    revalidatePath("/dashboard/seller")
    revalidatePath("/products")
}

export async function deleteProductAction(productId) {
    const session = await auth()

    if (!session?.user?.id) return { error: "Not authenticated" }

    const product = await verifyProductOwner(productId, session.user.id)
    if (!product) return { error: "Product not found" }

    // Check existing purchases — don't delete if buyers exist
    const purchaseCount = await prisma.purchase.count({
        where: { productId },
    })

    if (purchaseCount > 0) {
        return {
            error: "Cannot delete a product with existing purchases. Unpublish it instead.",
        }
    }

    // Delete files from UploadThing
    await utapi.deleteFiles([product.fileKey])

    await prisma.product.delete({
        where: { id: productId },
    })

    revalidatePath("/dashboard/seller")
    revalidatePath("/products")
}