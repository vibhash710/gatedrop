import StoreNavbar from "@/components/store/StoreNavbar"
import Footer from "@/components/store/Footer"

export default function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
      <StoreNavbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}