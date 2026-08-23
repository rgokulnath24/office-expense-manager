"use client";
import ExpenseModal from "@/components/ExpenseModal";
import ExpenseTable from "@/components/ExpenseTable";
import SummaryCard from "@/components/SummaryCard";
import { supabase } from "@/lib/supabase";
import { Expense } from "@/types/expense";
import { PlusIcon, RotateCcw, TrendingUp, User2, Wallet2, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [selectedExpenses, setSelectedExpenses] = useState<Expense | null>(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");



    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({
        totalAmount: 0,
        topPayer: "",
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
    async function fetchExpenses() {
        setLoading(true);


        let query = supabase
            .from("expenses")
            .select(
                `
        *,
        profiles(full_name)
      `
            ).eq("is_deleted", 0)
            .order("expense_date", {
                ascending: false,
            });


        const { data, error } = await query;




        setExpenses(data || []);

        setLoading(false);
    }

    async function fetchReport() {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        let query = supabase
            .from("expenses")
            .select("*")
            .eq("is_deleted", 0)
            .gte("expense_date", fromDate)
            .lte("expense_date", toDate)
            .order("expense_date", {
                ascending: false,
            });

        const { data } = await query;


        const expenseData = [...(data || [])].sort((a, b) =>
            a.expense_date.localeCompare(b.expense_date)
        );

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

        const totals = expenseData.reduce((acc, { paid_by, amount }) => {
            acc[paid_by] = (acc[paid_by] || 0) + amount;
            return acc;
        }, {});




        const entries = Object.entries(totals) as [string, number][];

        const highestPayer = entries.reduce(
            (highest, [person, total]) =>
                total > highest.total
                    ? { person, total }
                    : highest,
            { person: "", total: 0 }
        );

        setSummary({
            totalAmount,
            topPayer: highestPayer.person,
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
    return (<>
        <div className="p-8">
            <div className="flex items-center justify-between">

                <h1 className="text-3xl font-medium theme-text">
                    Expenses
                </h1>

                <button
                    onClick={() => { setSelectedExpenses(null); setOpen(true); }}
                    className="flex items-center gap-2 rounded-xl button-bg px-4 py-2 theme-text cursor-pointer"
                >
                    <PlusIcon size={18} />
                    Add Expense
                </button>
            </div>
            <div className="mt-0 rounded-2xl border date-border shadow-lg p-6">

                <div className="flex flex-wrap justify-center items-end gap-6">

                    <div className="flex flex-col min-w-[220px]">
                        <label className="mb-2 text-sm font-semimedium theme-text">
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

                    <div className="flex flex-col min-w-[220px]">
                        <label className="mb-2 text-sm font-semimedium theme-text">
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


            <div className="grid gap-5 mt-8 md:grid-cols-4">

                <SummaryCard
                    title="Total Amount"
                    value={`₹ ${summary.totalAmount}`}
                    icon={<Wallet2 size={28} className="text-green-600" />}
                />

                <SummaryCard
                    title="Top Payer"
                    value={summary.topPayer}
                    icon={<User2 size={28} className="text-blue-600" />}
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
                open={open}
                setOpen={setOpen}
                setSelectedExpenses={setSelectedExpenses}
                fetchExpenses={fetchExpenses}
                loading={loading}
                reports={true}
            />

        </div>



        <ExpenseModal
            open={open}
            setOpen={setOpen}
            selectedExpenses={selectedExpenses}
            fetchExpenses={fetchExpenses}
        />
    </>)
}