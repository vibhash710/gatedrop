import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProductForm from "@/components/products/ProductForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewProductPage() {
  const session = await auth()

  if (session?.user?.role !== "SELLER") {
    redirect("/dashboard")
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
          Create New Product
        </h1>
        <p className="text-gray-500 mt-1">
          Fill in the details below to list your product.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border dark:border-neutral-800 p-6">
        <ProductForm />
      </div>
    </div>
  )
}