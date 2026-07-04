import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingBag, Calendar, FileDown } from "lucide-react"
import BuyButton from "@/components/store/BuyButton"
import { Suspense } from "react"

// ISR — revalidate every 60 seconds
export const revalidate = 60

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id},
  })
  if (!product) return { title: "Product not found" }
  return {
    title: `${product.title} — GateDrop`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }) {

  const { id } = await params
  
  const [product, session] = await Promise.all([
    prisma.product.findUnique({
      where: { id, published: true },
      include: {
        seller: {
          select: { name: true, image: true },
        },
        _count: {
          select: { purchases: true },
        },
      },
    }),
    auth(),
  ])

  if (!product) notFound()

  // Check if user already purchased this product
  let alreadyPurchased = false
  if (session?.user?.id) {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: session.user.id,
        productId: product.id,
      },
    })
    alreadyPurchased = !!purchase
  }

  function getInitials(name) {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        {/* Left — Cover image */}
        <div className="relative w-full aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
          {product.coverImageUrl ? (
            <Image
              src={product.coverImageUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {product.title}
          </h1>

          {/* Seller */}
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="w-7 h-7">
              <AvatarImage src={product.seller?.image} />
              <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                {getInitials(product.seller?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.seller?.name || "Seller"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <ShoppingBag className="w-4 h-4" />
              {product._count.purchases} sold
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(product.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-4xl font-bold text-black dark:text-white">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          {/* Buy button */}
          <div className="mt-6">
            <Suspense fallback={null}>
              <BuyButton
                productId={product.id}
                alreadyPurchased={alreadyPurchased}
                isLoggedIn={!!session}
                userEmail={session?.user?.email}
                userName={session?.user?.name}
              />
            </Suspense>
          </div>

          {/* What you get */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
            <p className="text-sm font-medium text-black dark:text-white mb-2">
              What you get
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FileDown className="w-4 h-4 text-green-500" />
                Instant download after purchase
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FileDown className="w-4 h-4 text-green-500" />
                Lifetime access
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
          About this product
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      </div>
    </div>
  )
}