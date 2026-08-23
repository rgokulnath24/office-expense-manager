"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Expense {
  expense_date: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  loading: boolean;
}

export default function ExpenseTrendChart({ expenses }: Props) {
  const groupedData = expenses.reduce((acc: any, expense) => {
    const date = new Date(expense.expense_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    const existing = acc.find((item: any) => item.date === date);

    if (existing) {
      existing.amount += Number(expense.amount);
    } else {
      acc.push({
        date,
        amount: Number(expense.amount),
      });
    }

    return acc;
  }, []);

  return (
    <div className="mt-8 rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semimedium theme-text">
        Expense Trend
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={groupedData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="amount"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}