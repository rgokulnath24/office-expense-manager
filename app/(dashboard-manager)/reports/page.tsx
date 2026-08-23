"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Expense } from "@/types/expense";
import { RotateCcw } from "lucide-react";

import ExpenseTrendChart from "@/components/charts/ExpenseTrendChart";
import ExpenseTypeChart from "@/components/charts/ExpenseTypeChart";
import SessionChart from "@/components/charts/SessionChart";
import PaidByChart from "@/components/charts/PaidByChart";

export default function Analytics() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    setFromDate(formatDate(firstDay));
    setToDate(formatDate(today));
  }, []);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    fetchAnalytics();
  }, [fromDate, toDate]);

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  async function fetchAnalytics() {
    setLoading(true);

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("is_deleted", 0)
      .gte("expense_date", fromDate)
      .lte("expense_date", toDate)
      .order("expense_date", {
        ascending: true,
      });

    if (error) {
      console.error("Analytics error:", error);
      setLoading(false);
      return;
    }

    setExpenses(data || []);
    setLoading(false);
  }

  function handleReset() {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    setFromDate(formatDate(firstDay));
    setToDate(formatDate(today));
  }

  if (!fromDate || !toDate) {
    return null;
  }

  return (
    <div className="p-8">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium theme-text">
          Analytics
        </h1>
      </div>

      {/* Date Filter */}
      <div className="mt-6 rounded-2xl border date-border shadow-lg p-6">

        <div className="flex flex-wrap justify-center items-end gap-6">

          {/* From Date */}
          <div className="flex flex-col min-w-[220px]">
            <label className="mb-2 text-sm font-semimedium theme-text">
              From Date
            </label>

            <input
              type="date"
              className="h-11 rounded-xl border border-[#7acfc5]
              bg-[#0f645d] px-4 theme-text outline-none
              transition-all focus:border-[#c7d0ca]
              focus:ring-2 focus:ring-[#c7d0ca]"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col min-w-[220px]">
            <label className="mb-2 text-sm font-semimedium theme-text">
              To Date
            </label>

            <input
              type="date"
              className="h-11 rounded-xl border border-[#7acfc5]
              bg-[#0f645d] px-4 theme-text outline-none
              transition-all focus:border-[#c7d0ca]
              focus:ring-2 focus:ring-[#c7d0ca]"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            onClick={handleReset}
            className="h-11 px-6 rounded-xl border border-[#7acfc5]
            theme-text hover:bg-[#0f645d]
            transition-all duration-200
            flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>

        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6">

        {/* Expense Trend */}
        <ExpenseTrendChart
          expenses={expenses}
          loading={loading}
        />

        {/* Two column charts */}
        <div className="grid gap-6 lg:grid-cols-2">

          <ExpenseTypeChart
            expenses={expenses}
            loading={loading}
          />

          <SessionChart
            expenses={expenses}
            loading={loading}
          />

        </div>

        {/* Paid By */}
        <PaidByChart
          expenses={expenses}
          loading={loading}
        />

      </div>

    </div>
  );
}