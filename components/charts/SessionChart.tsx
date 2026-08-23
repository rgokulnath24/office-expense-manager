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
  expense_session: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  loading: boolean;
}

export default function SessionChart({ expenses }: Props) {
  const data = Object.values(
    expenses.reduce(
      (acc: Record<string, { session: string; amount: number }>, expense) => {
        const session = expense.expense_session || "Other";

        if (!acc[session]) {
          acc[session] = {
            session,
            amount: 0,
          };
        }

        acc[session].amount += Number(expense.amount);

        return acc;
      },
      {}
    )
  );

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semimedium theme-text">

        Session-wise Expenses
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="session" />

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