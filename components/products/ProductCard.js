"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { togglePublishAction, deleteProductAction } from "@/lib/actions/product.actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false)

  async function handleTogglePublish() {
    setLoading(true)
    const result = await togglePublishAction(product.id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(product.published ? "Product unpublished" : "Product published")
    }
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    const result = await deleteProductAction(product.id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Product deleted")
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-4 flex gap-4">

      {/* Cover image */}
      <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-neutral-800">
        {product.coverImageUrl ? (
          <Image
            src={product.coverImageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-1">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-black dark:text-white truncate">
              {product.title}
            </h3>
            <Badge
              variant={product.published ? "default" : "secondary"}
              className="shrink-0 text-[10px] px-1.5 py-0"
            >
              {product.published ? "Live" : "Draft"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-black dark:text-white">
            ₹{product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <ShoppingBag className="w-3 h-3" />
            {product._count.purchases} sale{product._count.purchases !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-red-500 hover:text-red-600 hover:border-red-300"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The product will be permanently removed.
                  If it has existing purchases it cannot be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

    </div>
  )
}