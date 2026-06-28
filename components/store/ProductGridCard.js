import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingBag } from "lucide-react"

export default function ProductGridCard({ product }) {
  function getInitials(name) {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white dark:bg-neutral-900 rounded-xl border dark:border-neutral-800 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Cover image */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-neutral-800">
        {product.coverImageUrl ? (
          <Image
            src={product.coverImageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="font-semibold text-black dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Seller + price row */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={product.seller?.image} />
              <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                {getInitials(product.seller?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 truncate max-w-24">
              {product.seller?.name || "Seller"}
            </span>
          </div>

          <div className="text-right">
            <p className="font-bold text-black dark:text-white">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
              <ShoppingBag className="w-3 h-3" />
              {product._count.purchases}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}