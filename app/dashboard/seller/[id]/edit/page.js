import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/products/ProductForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditProductPage({ params }) {
  const session = await auth()

  if (session?.user?.role !== "SELLER") {
    redirect("/dashboard")
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product || product.sellerId !== session.user.id) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/seller"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Edit Product
        </h1>
        <p className="text-gray-500 mt-1">
          Update your product details below.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border dark:border-neutral-800 p-6">
        <ProductForm product={product} />
      </div>
    </div>
  )
}