"use client";
import SummaryCard from "@/components/SummaryCard";
import { supabase } from "@/lib/supabase";
import { Calendar, Coffee, Receipt, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    totalEntries: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, [])
  const fetchSummary = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


    const isAdmin = profile?.role === "admin";

    let query = supabase
      .from("expenses")
      .select("*")
      .eq("is_deleted", 0);

    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data: expenses, error } = await query;

    if (error) {
      console.log(error);
      return;
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const day = new Date().getDay();

    const today = new Date();


    const StartOfMonth = new Date(today);
    StartOfMonth.setDate(1);
    StartOfMonth.setHours(0, 0, 0, 0);

    const EndOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    EndOfMonth.setHours(23, 59, 59, 999);


    const monday = new Date(today);

    const diff = day === 0 ? 6 : day - 1;
    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);



    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);
    saturday.setHours(23, 59, 59, 999);



    const weekExpense = expenses.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);

      return expenseDate >= monday && expenseDate <= saturday;
    });

    const monthlyExpense = expenses.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);

      return expenseDate >= StartOfMonth && expenseDate <= EndOfMonth;
    });




    const totalWeekExpense = weekExpense.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    const monthlyExpenses = monthlyExpense.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const todayExpense = expenses.filter((expense) => expense.expense_date == todayDate);
    const totalTodayExpense = todayExpense.reduce((sum, total) => sum + total.amount, 0);


    const totalEntries = todayExpense.length;



    setSummary((prev) => ({ ...prev, today: totalTodayExpense, totalEntries: totalEntries, week: totalWeekExpense, month: monthlyExpenses }))

  };

  return (<>
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold theme-text">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mt-8">

        <SummaryCard
          title="Today's Spend"
          value={
            <CountUp
              end={summary.today}
              duration={0.3}
              prefix="₹"
            />
          }
          icon={<Coffee />}
        />

        <SummaryCard
          title="This Week"
          value={`₹${summary.week}`}
          icon={<Calendar />}
        />

        <SummaryCard
          title="This Month"
          value={`₹${summary.month}`}
          icon={<Wallet />}
        />

        <SummaryCard
          title="Total Entries"
          value={<CountUp end={summary.totalEntries} duration={0.3} />}
          icon={<Receipt />}
        />

      </div>
    </div>
  </>)
}