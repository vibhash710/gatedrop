import Link from "next/link"
import { ArrowRight, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import StoreNavbar from "@/components/store/StoreNavbar"

const CATEGORIES = ["Courses", "Ebooks", "Templates", "Code", "Design assets"]

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-neutral-950">
      <StoreNavbar />

      <main className="relative">
        <div className="relative max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[85vh] text-center">

          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2A93B]" />
            For people who make and find good things
          </span>

          {/* Headline with gate bars */}
          <div className="relative flex items-center justify-center gap-5 sm:gap-8">
            <span
              aria-hidden
              className="hidden sm:block w-px bg-neutral-300 dark:bg-neutral-700 motion-safe:animate-gate-left"
              style={{ height: "0.85em", alignSelf: "center" }}
            />
            <h1 className="font-black tracking-tight text-[13vw] sm:text-6xl md:text-7xl leading-[0.95] text-neutral-900 dark:text-white">
              Drop your work.
              <br />
              <span className="text-[#D98C1F] dark:text-[#F2A93B]">Open the gate.</span>
            </h1>
            <span
              aria-hidden
              className="hidden sm:block w-px bg-neutral-300 dark:bg-neutral-700 motion-safe:animate-gate-right"
              style={{ height: "0.85em", alignSelf: "center" }}
            />
          </div>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mt-8 mb-10">
            A marketplace for courses, ebooks, templates, code and design assets.
            Just a link and a price — no storefront needed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="bg-[#D98C1F] hover:bg-[#C67C13] dark:bg-[#F2A93B] dark:hover:bg-[#E09B2E] text-white dark:text-neutral-950 gap-2 h-12 px-7 text-base font-semibold shadow-lg shadow-amber-900/10"
            >
              <Link href="/products">
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            {session && (
              <Button
                size="lg"
                variant="outline"
                asChild
                className="gap-2 h-12 px-7 text-base font-semibold"
              >
                <Link href="/dashboard">
                  <LayoutGrid className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mt-10 text-sm text-neutral-500 dark:text-neutral-500">
            {CATEGORIES.map((cat, i) => (
              <span key={cat} className="flex items-center gap-3">
                {cat}
                {i < CATEGORIES.length - 1 && (
                  <span className="text-neutral-300 dark:text-neutral-700">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes gate-left {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        @keyframes gate-right {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        .animate-gate-left {
          transform-origin: center;
          animation: gate-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .animate-gate-right {
          transform-origin: center;
          animation: gate-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
      `}</style>
    </div>
  )
}