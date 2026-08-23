"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Expense {
  expense_type: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  loading: boolean;
}

export default function ExpenseTypeChart({ expenses }: Props) {
  const data = Object.values(
    expenses.reduce(
      (acc: Record<string, { name: string; amount: number }>, expense) => {
        const type = expense.expense_type || "Other";

        if (!acc[type]) {
          acc[type] = {
            name: type,
            amount: 0,
          };
        }

        acc[type].amount += Number(expense.amount);

        return acc;
      },
      {}
    )
  );

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semimedium theme-text">

        Expense by Type
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}