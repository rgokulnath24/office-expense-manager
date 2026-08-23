"use client";

import { Coffee } from "lucide-react";

interface SessionData {
  amount: number;
  entries: number;
}

interface Props {
  sessionTotals: Record<string, SessionData>;
}

export default function DashboardSessions({
  sessionTotals,
}: Props) {
  return (
    <div className="rounded-2xl border date-border bg-white p-6 shadow-lg"> 

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium ">
            Today's Sessions
          </h2>

          <p className="mt-1 text-sm  opacity-60">
            Spending by session
          </p>
        </div>

        <Coffee size={22} className="" />
      </div>

      {Object.keys(sessionTotals).length === 0 ? (
        <div className="py-8 text-center text-sm opacity-60">
          No expenses recorded today.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(sessionTotals).map(
            ([session, data]) => (
              <div
                key={session}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">
                    {session}
                  </p>

                  <p className="mt-1 text-sm opacity-60">
                    {data.entries}{" "}
                    {data.entries === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <p className="text-lg font-medium">
                  ₹{data.amount}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div> 
  );
}