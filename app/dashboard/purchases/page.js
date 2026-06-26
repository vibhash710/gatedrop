import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Download, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import PurchaseSuccessToast from "@/components/purchases/PurchaseSuccessToast"

export default async function PurchasesPage({ searchParams }) {
  const session = await auth()

  if (!session?.user?.id) redirect("/login")

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          seller: { select: { name: true } },
        },
      },
    },
  })

  const showSuccess = searchParams?.success === "true"

  return (
    <div>
      {showSuccess && <PurchaseSuccessToast />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Your Purchases
        </h1>
        <p className="text-gray-500 mt-1">
          {purchases.length} purchase{purchases.length !== 1 ? "s" : ""}
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed dark:border-neutral-800 rounded-xl">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-black dark:text-white mb-2">
            No purchases yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Browse products and make your first purchase.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Cover image */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-neutral-800">
                {purchase.product.coverImageUrl ? (
                  <Image
                    src={purchase.product.coverImageUrl}
                    alt={purchase.product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-black dark:text-white truncate">
                  {purchase.product.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  by {purchase.product.seller?.name || "Seller"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Purchased {new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Price + Download */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-black dark:text-white">
                  ₹{purchase.product.price.toFixed(2)}
                </span>
                <Button size="sm" asChild>
                  <a href={`/api/download/${purchase.product.id}`}>
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}