"use client";

import { Expense } from "@/types/expense";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteExpense } from "./DeleteExpense";

interface ExpenseTableProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  expenses: Expense[];
  loading: boolean;
  // isAdmin: boolean;
  reports?:boolean;
  fetchExpenses: () => Promise<void>;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<Expense | null>>;
}

export default function ExpenseTable({
  expenses,
  loading,
  setSelectedExpenses,
  fetchExpenses,
  setOpen,
  reports
}: ExpenseTableProps) {
  if (loading) {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="button-bg">
            <tr>
              <th className="p-3 text-left">Date</th> 
             <th className="p-3 text-left">Paid By</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Notes</th>
              {reports && <th className="p-3 text-left">Action</th>}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-t animate-pulse">
                <td className="p-3">
                  <div className="h-4 w-34 rounded bg-gray-200"></div>
                </td>

                  <td className="p-3">
                    <div className="h-4 w-34 rounded bg-gray-200"></div>
                  </td>

                <td className="p-3">
                  <div className="h-4 w-34 rounded bg-gray-200"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-34 rounded bg-gray-200"></div>
                </td>

                <td className="p-3">
                  <div className="h-4 w-34 rounded bg-gray-200"></div>
                </td>
                {reports && <td className="p-3">
                  <div className="h-4 w-34 rounded bg-gray-200"></div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (expenses.length === 0) {
    return (
      <div className="mt-6 rounded-xl border p-6 text-center text-white">
        No expenses found.
      </div>
    );
  }
  const [selectedId, setSelectedId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DeleteExpense
        Deleteopen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        selectedExpenseId={selectedId}
        fetchExpenses={fetchExpenses} />
      <div className="mt-6 overflow-hidden rounded-xl border bg-white">

        <table className="w-full">
          <thead className="button-bg">
            <tr>
              <th className="p-3 text-left">Date</th>


              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Session</th>
              <th className="p-3 text-left">Paid By</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Notes</th>
              {reports && <th className="p-3 text-left">Action</th>}
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">
                  {new Date(expense.expense_date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                    .replace(/\//g, "-")}
                </td>

                <td className="p-3">{expense.expense_type}</td>
                <td className="p-3">{expense.expense_session}</td>

                <td className="p-3">
                  {expense.paid_by}
                </td>

                <td className="p-3 font-semibold">
                  ₹ {expense.amount}
                </td>

                <td className="p-3">{expense.notes}</td>
                {reports &&<td className="p-3">
                   <div className="flex items-center gap-4">
                    <button onClick={() => { setOpen(true); setSelectedExpenses(expense); }}><Pencil
                      size={18}
                      className="cursor-pointer text-blue-500"
                    /></button>

                    <button onClick={() => { setSelectedId(expense.id); setDeleteOpen(true); }}><Trash2
                      size={18}
                      className="cursor-pointer text-red-500"
                    /></button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}