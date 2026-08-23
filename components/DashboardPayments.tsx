"use client";

import { Wallet } from "lucide-react";

interface Props {
  payerEntries: [string, number][];
}

export default function DashboardPayments({
  payerEntries,
}: Props) {
  return (
    <div className="rounded-2xl border date-border bg-white p-6 shadow-lg">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium ">
            Today's Payments
          </h2>

          <p className="mt-1 text-sm  opacity-60">
            Who paid today
          </p>
        </div>

        <Wallet size={22} className="" />
      </div>

      {payerEntries.length === 0 ? (
        <div className="py-8 text-center text-sm  opacity-60">
          No payments recorded today.
        </div>
      ) : (
        <div className="space-y-4">
          {payerEntries.map(
            ([person, amount], index) => (
              <div
                key={person}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full button-bg text-sm font-semibold theme-text">
                    {index + 1}
                  </div>

                  <span className="font-medium">
                    {person}
                  </span>

                </div>

                <span className="font-medium">
                  ₹{amount}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}