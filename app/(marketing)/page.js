import Link from "next/link"
import { Button } from "@/components/ui/button"
import StoreNavbar from "@/components/store/StoreNavbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <StoreNavbar />
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
            Buy and sell digital products
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mb-8">
            GateDrop is the simplest way to sell your digital work — ebooks, templates, code, design assets and more.
          </p>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Start Selling</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}