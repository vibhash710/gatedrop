import { prisma } from "@/lib/prisma"
import ProductGridCard from "@/components/store/ProductGridCard"
import { Package } from "lucide-react"

// ISR — revalidate every 60 seconds
export const revalidate = 60

export const metadata = {
  title: "Browse Products — GateDrop",
  description: "Discover and download digital products",
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: { name: true, image: true },
      },
      _count: {
        select: { purchases: true },
      },
    },
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Browse Products
        </h1>
        <p className="text-gray-500 mt-1">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-black dark:text-white mb-1">
            No products yet
          </h2>
          <p className="text-gray-500 text-sm">
            Check back soon — sellers are uploading products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}