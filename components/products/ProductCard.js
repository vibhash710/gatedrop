"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { togglePublishAction, deleteProductAction } from "@/lib/actions/product.actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react"

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleTogglePublish() {
    setLoading(true)
    setError("")
    const result = await togglePublishAction(product.id)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return
    setLoading(true)
    setError("")
    const result = await deleteProductAction(product.id)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-4 flex gap-4">

      {/* Cover image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-neutral-800">
        {product.coverImageUrl ? (
          <Image
            src={product.coverImageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-black dark:text-white truncate">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
              {product.description}
            </p>
          </div>
          <Badge variant={product.published ? "default" : "secondary"}>
            {product.published ? "Live" : "Draft"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm font-medium text-black dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <ShoppingBag className="w-3 h-3" />
            {product._count.purchases} sale{product._count.purchases !== 1 ? "s" : ""}
          </span>
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTogglePublish}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : product.published ? (
              <><EyeOff className="w-3 h-3 mr-1" /> Unpublish</>
            ) : (
              <><Eye className="w-3 h-3 mr-1" /> Publish</>
            )}
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/seller/${product.id}/edit`}>
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-600 hover:border-red-300"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>

    </div>
  )
}