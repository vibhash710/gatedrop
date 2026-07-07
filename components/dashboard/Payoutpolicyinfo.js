"use client"

import { useState } from "react"
import { Info, IndianRupee, X } from "lucide-react"

export default function PayoutPolicyInfo({ commissionPercent }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:underline transition-colors"
        aria-label="Payout policy details"
      >
        <Info className="w-4 h-4" />
        Payout policy
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-black dark:text-white text-lg">
                  Payout Policy
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black dark:hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2.5 leading-relaxed">
              <li>Seller payouts are processed manually.</li>

              <li>
                To receive your earnings, you must submit a payout request through
                the Contact page.
              </li>

              <li>
                Payout requests should be submitted on or after the{" "}
                <span className="font-medium text-black dark:text-white">1st of each month</span>.
              </li>

              <li>
                Once we receive your request, we will verify your account and process
                your payout within{" "}
                <span className="font-medium text-black dark:text-white">48 hours</span>.
              </li>

              <li>Payments are made via UPI or bank transfer.</li>

              <li>
                Please include your registered email address and your preferred
                payout method (UPI ID or bank account details) in your request.
              </li>

              <li>
                GateDrop retains a{" "}
                <span className="font-medium text-black dark:text-white">
                  {commissionPercent}% platform fee
                </span>{" "}
                on all sales.
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}