"use client";

import SummaryCard from "@/components/SummaryCard";
import DashboardSessions from "@/components/DashboardSessions";
import DashboardPayments from "@/components/DashboardPayments";
import RecentExpenses from "@/components/RecentExpenses";
import QuickActions from "@/components/QuickActions";

import { supabase } from "@/lib/supabase";
import {
  Calendar,
  Coffee,
  Receipt,
  Wallet,
} from "lucide-react";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { formatDate } from "@/utils/commonFunction";

interface Expense {
  id: string;
  expense_date: string;
  expense_type: string;
  expense_session: string;
  paid_by: string;
  amount: number;
  notes: string;
  user_id: string;
  is_deleted: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    totalEntries: 0,
  });

  const [todayExpenses, setTodayExpenses] = useState<Expense[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchSummary();
  }, []);


  async function fetchSummary() {

    let query = supabase
      .from("expenses")
      .select("*")
      .eq("is_deleted", 0)
      .order("expense_date", {
        ascending: false,
      });


    const { data: expenses, error } = await query;

    if (error) {
      console.log(error);
      return;
    }

    const expenseData = (expenses || []) as Expense[];

    const today = new Date();

    const todayDate = formatDate(today);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    endOfMonth.setHours(23, 59, 59, 999);


    const day = today.getDay();

    const diff = day === 0 ? 6 : day - 1;

    const monday = new Date(today);


    monday.setDate(today.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const saturday = new Date(monday);

    saturday.setDate(monday.getDate() + 5);
    saturday.setHours(23, 59, 59, 999);


    const todayExpense = expenseData.filter(
      (expense) =>
        expense.expense_date === todayDate
    );

    const weekExpense = expenseData.filter( 
      (expense) => {
        const expenseDate = new Date(
          expense.expense_date
        );

        return (
          expenseDate >= monday &&
          expenseDate <= saturday
        );
      }
    );

    const monthlyExpense = expenseData.filter(
      (expense) => {
        const expenseDate = new Date(
          expense.expense_date
        );

        return (
          expenseDate >= startOfMonth &&
          expenseDate <= endOfMonth
        );
      }
    );

  

    const totalToday = todayExpense.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

    const totalWeek = weekExpense.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

    const totalMonth = monthlyExpense.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

    setSummary({
      today: totalToday,
      week: totalWeek,
      month: totalMonth,
      totalEntries: todayExpense.length,
    });

    setTodayExpenses(todayExpense);

    setRecentExpenses(
      expenseData.slice(0, 5)
    );
  }

  // -----------------------
  // Session totals
  // -----------------------

  const sessionTotals = todayExpenses.reduce(
    (
      acc: Record<
        string,
        {
          amount: number;
          entries: number;
        }
      >,
      expense
    ) => {
      const session =
        expense.expense_session || "Other";

      if (!acc[session]) {
        acc[session] = {
          amount: 0,
          entries: 0,
        };
      }

      acc[session].amount += Number(
        expense.amount
      );

      acc[session].entries += 1;

      return acc;
    },
    {}
  );

  // -----------------------
  // Payer totals
  // -----------------------

  const payerTotals = todayExpenses.reduce(
    (
      acc: Record<string, number>,
      expense
    ) => {
      const person =
        expense.paid_by || "Unknown";

      acc[person] =
        (acc[person] || 0) +
        Number(expense.amount);

      return acc;
    },
    {}
  );

  const payerEntries = Object.entries(
    payerTotals
  ).sort(
    ([, amountA], [, amountB]) =>
      amountB - amountA
  );

  return (
    <div className="flex-1 p-8">

      <h1 className="text-3xl font-medium theme-text">
        Have a Break !
      </h1>

      {/* KPI */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

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
          title="Today's Entries"
          value={
            <CountUp
              end={summary.totalEntries}
              duration={0.3}
            />
          }
          icon={<Receipt />}
        />

      </div>

      {/* Sessions + Payments */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <DashboardSessions
          sessionTotals={sessionTotals}
        />

        <DashboardPayments
          payerEntries={payerEntries}
        />

      </div>

      {/* Recent Expenses */}
      <RecentExpenses
        expenses={recentExpenses}
      />

      {/* Quick Actions */}
      <QuickActions />

    </div>
  );
}