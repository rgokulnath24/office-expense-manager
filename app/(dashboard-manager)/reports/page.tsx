"use client";

import { useEffect, useState } from "react";
import SummaryCard from "@/components/SummaryCard";

import {
    ReceiptText,
    RotateCcw,
    TrendingUp,
    Wallet2,
    WalletCards,
} from "lucide-react";
import { Expense } from "@/types/expense";
import ExpenseTable from "@/components/ExpenseTable";
import { supabase } from "@/lib/supabase";

export default function Analytics() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    // const [isAdmin, setIsAdmin] = useState(false);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [summary, setSummary] = useState({
        totalAmount: 0,
        totalEntries: 0,
        averageExpense: 0,
        highestExpenses: 0,
    });

    useEffect(() => {
        const today = new Date();
        const firstDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const start = firstDay.toISOString().split("T")[0];
        const end = today.toISOString().split("T")[0];

        setFromDate(start);
        setToDate(end);
    }, []);

    useEffect(() => {
        if (!fromDate || !toDate) return;

        fetchReport();
    }, [fromDate, toDate]);


    async function fetchReport() {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        // const admin = profile?.role === "admin";

        // setIsAdmin(admin);

        let query = supabase
            .from("expenses")
            .select(
                `
        *,
        profiles(full_name)
      `
            )
            .eq("is_deleted", 0)
            .gte("expense_date", fromDate)
            .lte("expense_date", toDate)
            .order("expense_date", {
                ascending: false,
            });

        // if (!admin) {
        //     query = query.eq("user_id", user.id);
        // }

        const { data } = await query;

        const expenseData = data || [];

        setExpenses(expenseData);

        const totalAmount = expenseData.reduce(
            (sum: number, item: any) => sum + Number(item.amount),
            0
        );

        const HighestExpenses = expenseData.reduce((max, exp) => {
            return Number(exp.amount) > max
                ? Number(exp.amount)
                : max;
        }, 0);
        setSummary({
            totalAmount,
            totalEntries: expenseData.length,
            averageExpense:
                expenseData.length > 0
                    ? Math.round(totalAmount / expenseData.length)
                    : 0,

            highestExpenses: HighestExpenses
        });

        setLoading(false);
    }

    function handleReset() {
        const today = new Date();

        const firstDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        setFromDate(firstDay.toISOString().split("T")[0]);
        setToDate(today.toISOString().split("T")[0]);
    }
    return (
        <div className="p-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold theme-text">
                    Analytics
                </h1>
            </div>
            <div className="mt-6 rounded-2xl border date-border shadow-lg p-6">

                <div className="flex flex-wrap justify-center items-end gap-6">

                    {/* From Date */}
                    <div className="flex flex-col min-w-[220px]">
                        <label className="mb-2 text-sm font-semibold theme-text">
                            From Date
                        </label>

                        <input
                            type="date"
                            className="h-11 rounded-xl border border-[#7acfc5] bg-[#0f645d] px-4 theme-text outline-none transition-all
        focus:border-[#c7d0ca] focus:ring-2 focus:ring-[#c7d0ca]"
                            value={fromDate}
                            max={toDate || undefined}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    {/* To Date */}
                    <div className="flex flex-col min-w-[220px]">
                        <label className="mb-2 text-sm font-semibold theme-text">
                            To Date
                        </label>

                        <input
                            type="date"
                            className="h-11 rounded-xl border border-[#7acfc5] bg-[#0f645d] px-4 theme-text outline-none transition-all
        focus:border-[#c7d0ca] focus:ring-2 focus:ring-[#c7d0ca]"
                            value={toDate}
                            min={fromDate || undefined}

                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleReset}
                        className="h-11 px-6 rounded-xl border border-[#7acfc5]
      theme-text hover:bg-[#0f645d] transition-all duration-200
      flex items-center gap-2"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>

                </div>

            </div>


            {/* Summary Cards */}
            <div className="grid gap-5 mt-8 md:grid-cols-4">

                <SummaryCard
                    title="Total Amount"
                    value={`₹ ${summary.totalAmount}`}
                    icon={<Wallet2 size={28} className="text-green-600" />}
                />

                <SummaryCard
                    title="Total Entries"
                    value={summary.totalEntries}
                    icon={<ReceiptText size={28} className="text-blue-600" />}
                />

                <SummaryCard
                    title="Average Expense"
                    value={`₹ ${summary.averageExpense}`}
                    icon={<TrendingUp size={28} className="text-orange-500" />}
                />

                <SummaryCard
                    title="Highest Expense"
                    value={`₹ ${summary.highestExpenses}`}
                    icon={<WalletCards size={28} className="text-orange-500" />}
                />

            </div>

            <ExpenseTable
                expenses={expenses}
                loading={loading}
                open={false}
                setOpen={() => { }}
                fetchExpenses={fetchReport}
                setSelectedExpenses={() => { }}
            />

        </div>

    );
}