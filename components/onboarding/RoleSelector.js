"use client"

import { useState } from "react"
import { selectRoleAction } from "@/lib/actions/user.actions"
import { ShoppingBag, Store, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const roles = [
  {
    id: "BUYER",
    title: "I want to buy",
    description:
      "Browse and purchase digital products from creators. Access your downloads anytime.",
    icon: ShoppingBag,
    perks: ["Browse all products", "Instant downloads", "Purchase history"],
  },
  {
    id: "SELLER",
    title: "I want to sell",
    description:
      "Upload and sell your digital products. Reach buyers and earn from your work.",
    icon: Store,
    perks: ["Upload products", "Manage your store", "Track sales"],
  },
]

export default function RoleSelector({ userName }) {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    setError("")

    try {
      const result = await selectRoleAction(selected)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // if no error, selectRoleAction redirects server-side
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selected === role.id

          return (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`relative text-left p-6 rounded-xl border-2 transition-all duration-150 ${
                isSelected
                  ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-800"
                  : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-gray-300 dark:hover:border-neutral-600"
              }`}
            >
              {/* Checkmark when selected */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-white dark:text-black" />
                </div>
              )}

              <div className="mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                  isSelected
                    ? "bg-black dark:bg-white"
                    : "bg-gray-100 dark:bg-neutral-800"
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected
                      ? "text-white dark:text-black"
                      : "text-gray-600 dark:text-gray-400"
                  }`} />
                </div>

                <h2 className="text-lg font-semibold text-black dark:text-white mb-1">
                  {role.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role.description}
                </p>
              </div>

              <ul className="space-y-1.5">
                {role.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Continue button */}
      <Button
        onClick={handleContinue}
        disabled={!selected || loading}
        className="w-full h-11 text-sm font-medium"
      >
        {loading ? (
          "Setting up your account..."
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

    </div>
  )
}