"use client";

import {
  Plus,
  FileText,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="mt-6">

      <h2 className="mb-4 text-xl font-semibold theme-text">
        Quick Actions
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">

        <button
          onClick={() => router.push("/expenses")}
          className="flex items-center gap-3 rounded-2xl border date-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="rounded-xl button-bg p-3">
            <Plus size={22} />
          </div>

          <div>
            <p className="font-semibold">
              Add Expense
            </p>

            <p className="text-sm opacity-60">
              Record a new expense
            </p>
          </div>
        </button>

        <button
          onClick={() => router.push("/reports")}
          className="flex items-center gap-3 rounded-2xl border date-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="rounded-xl button-bg p-3">
            <FileText size={22} />
          </div>

          <div>
            <p className="font-semibold">
              View Reports
            </p>

            <p className="text-sm opacity-60">
              Check expense records
            </p>
          </div>
        </button>

        <button
          onClick={() => router.push("/analytics")}
          className="flex items-center gap-3 rounded-2xl border date-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="rounded-xl button-bg p-3">
            <BarChart3 size={22} />
          </div>

          <div>
            <p className="font-semibold">
              View Analytics
            </p>

            <p className="text-sm opacity-60">
              Explore spending patterns
            </p>
          </div>
        </button>

      </div>
    </div>
  );
}