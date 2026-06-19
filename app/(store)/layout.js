import StoreNavbar from "@/components/store/StoreNavbar"

export default function StoreLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <StoreNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}