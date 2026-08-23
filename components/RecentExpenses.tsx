"use client";

import { Receipt } from "lucide-react";

interface Expense {
  id: string;
  expense_date: string;
  expense_type: string;
  expense_session: string;
  paid_by: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
}

export default function RecentExpenses({
  expenses,
}: Props) {
  return (
    <div className="mt-6 rounded-2xl border date-border bg-white p-6 shadow-lg">

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold ">
            Recent Expenses
          </h2>

          <p className="mt-1 text-sm  opacity-60">
            Latest expense entries
          </p>
        </div>

        <Receipt size={22} className="" />

      </div>

      {expenses.length === 0 ? (
        <div className="py-8 text-center text-sm  opacity-60">
          No expenses found.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-3 text-left text-sm font-semibold ">
                  Date
                </th>

                <th className="p-3 text-left text-sm font-semibold ">
                  Type
                </th>

                <th className="p-3 text-left text-sm font-semibold ">
                  Session
                </th>

                <th className="p-3 text-left text-sm font-semibold ">
                  Paid By
                </th>

                <th className="p-3 text-right text-sm font-semibold ">
                  Amount
                </th>

              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >

                  <td className="p-3 text-sm">
                    {new Date(
                      expense.expense_date
                    ).toLocaleDateString("en-GB")}
                  </td>

                  <td className="p-3 text-sm">
                    {expense.expense_type}
                  </td>

                  <td className="p-3 text-sm">
                    {expense.expense_session}
                  </td>

                  <td className="p-3 text-sm">
                    {expense.paid_by}
                  </td>

                  <td className="p-3 text-right font-semibold">
                    ₹{expense.amount}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}