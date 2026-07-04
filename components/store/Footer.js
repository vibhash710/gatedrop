import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t dark:border-neutral-800 bg-white dark:bg-neutral-900 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">

          {/* Left — Logo + tagline */}
          <div>
            <Link
              href="/"
              className="font-bold text-lg text-black dark:text-white"
            >
              GateDrop
            </Link>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              The simplest way to buy and sell digital products online.
            </p>
          </div>

          {/* Middle — Links */}
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Right — Copyright */}
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} GateDrop. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}