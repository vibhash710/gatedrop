import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/products/ProductCard"

export default async function SellerDashboardPage() {
  const session = await auth()

  if (session?.user?.role !== "SELLER") {
    redirect("/dashboard")
  }

  const products = await prisma.product.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { purchases: true } },
    },
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Your Products
          </h1>
          <p className="text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/seller/new">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed dark:border-neutral-800 rounded-xl">
          <h2 className="text-lg font-medium text-black dark:text-white mb-2">
            No products yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Create your first product to start selling.
          </p>
          <Button asChild>
            <Link href="/dashboard/seller/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  )
}