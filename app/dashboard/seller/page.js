import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, TrendingUp, ShoppingBag, IndianRupee, Clock, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/products/ProductCard"
import PayoutPolicyInfo from "@/components/dashboard/Payoutpolicyinfo"

export default async function SellerDashboardPage() {
  const session = await auth()

  if (session?.user?.role !== "SELLER") {
    redirect("/dashboard")
  }

  const [products, purchases, payouts, config] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { purchases: true } },
      },
    }),
    prisma.purchase.findMany({
      where: { sellerId: session.user.id },
      include: {
        product: { select: { title: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.payout.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.platformConfig.findFirst(),
  ])

  const commissionPercent = config?.commissionPercent ?? 10
  const totalEarnings = purchases.reduce((sum, p) => sum + p.sellerEarnings, 0)
  const totalPaidOut = payouts.reduce((sum, p) => sum + p.amount, 0)
  const pendingPayout = Math.max(0, totalEarnings - totalPaidOut)
  const totalSales = purchases.length
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <ShoppingBag className="w-4 h-4" />
            Total Sales
          </div>
          <p className="text-2xl font-bold text-black dark:text-white">
            {totalSales}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Gross Revenue
          </div>
          <p className="text-2xl font-bold text-black dark:text-white">
            ₹{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <IndianRupee className="w-4 h-4" />
            Total Earned
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{totalEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            after {commissionPercent}% fee
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Wallet className="w-4 h-4" />
            Total Paid Out
          </div>
          <p className="text-2xl font-bold text-black dark:text-white">
            ₹{totalPaidOut.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Clock className="w-4 h-4" />
            Pending Payout
          </div>
          <p className={`text-2xl font-bold ${pendingPayout > 0 ? "text-amber-500" : "text-gray-400"}`}>
            ₹{pendingPayout.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payout Policy — compact trigger instead of full banner */}
      <div className="mb-8">
        <PayoutPolicyInfo commissionPercent={commissionPercent} />
      </div>

      {/* Products Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Your Products
          </h1>
          <p className="text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/seller/new">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed dark:border-neutral-800 rounded-xl">
          <h2 className="text-lg font-medium text-black dark:text-white mb-2">
            No products yet
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Create your first product to start selling.
          </p>
          <Button asChild>
            <Link href="/dashboard/seller/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Recent Sales Table */}
      {purchases.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Recent Sales
          </h2>
          <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-neutral-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Platform fee</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Your earnings</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="border-b dark:border-neutral-800 last:border-0"
                  >
                    <td className="px-4 py-3 text-black dark:text-white truncate max-w-48">
                      {purchase.product.title}
                    </td>
                    <td className="px-4 py-3 text-right text-black dark:text-white">
                      ₹{purchase.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-500">
                      -₹{purchase.platformFee.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-medium">
                      ₹{purchase.sellerEarnings.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payout History */}
      {payouts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            Payout History
          </h2>
          <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-neutral-800">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Note</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Amount paid</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b dark:border-neutral-800 last:border-0"
                  >
                    <td className="px-4 py-3 text-black dark:text-white">
                      {payout.note || "Payout"}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-medium">
                      ₹{payout.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {new Date(payout.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}