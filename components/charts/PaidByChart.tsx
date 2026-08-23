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
  paid_by: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  loading: boolean;
}

export default function PaidByChart({ expenses }: Props) {
  const data = Object.values(
    expenses.reduce(
      (acc: Record<string, { name: string; amount: number }>, expense) => {
        const person = expense.paid_by || "Unknown";

        if (!acc[person]) {
          acc[person] = {
            name: person,
            amount: 0,
          };
        }

        acc[person].amount += Number(expense.amount);

        return acc;
      },
      {}
    )
  );

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semimedium theme-text">

        Expenses by Paid By
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            left: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey="name"
          />

          <Tooltip />

          <Bar
            dataKey="amount"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}