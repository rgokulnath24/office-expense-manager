"use client";
import ExpenseModal from "@/components/ExpenseModal";
import ExpenseTable from "@/components/ExpenseTable";
import { supabase } from "@/lib/supabase";
import { Expense } from "@/types/expense";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [selectedExpenses,setSelectedExpenses]=useState<Expense | null>(null);

    const [loading, setLoading] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);
    async function fetchExpenses() {
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


        const admin = profile?.role === "admin";

        setIsAdmin(admin);

        let query = supabase
            .from("expenses")
            .select(
                `
        *,
        profiles(full_name)
      `
            ).eq("is_deleted",0)
            .order("expense_date", {
                ascending: false,
            });

        if (!admin) {
            query = query.eq("user_id", user.id);
        }

        const { data, error } = await query;

        console.log(data);
        console.log(error);

        setExpenses(data || []);

        setLoading(false);
    }
    return (<>
        <div className="p-8">

            <div className="flex items-center justify-between">

                <h1 className="text-3xl font-bold theme-text">
                    Expenses
                </h1>

                <button
                    onClick={() => {setSelectedExpenses(null);setOpen(true);}}
                    className="flex items-center gap-2 rounded-xl button-bg px-4 py-2 theme-text"
                >
                    <PlusIcon size={18} />
                    Add Expense
                </button>
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

            <ExpenseModal
                open={open}
                setOpen={setOpen}
                selectedExpenses={selectedExpenses}
                fetchExpenses={fetchExpenses}
            />
        </div>
    </>)
}