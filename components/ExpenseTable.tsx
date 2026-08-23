"use client";

import { Expense } from "@/types/expense";
import { ArrowBigLeft, ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteExpense } from "./DeleteExpense";

interface ExpenseTableProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  expenses: Expense[];
  loading: boolean;
  // isAdmin: boolean;
  reports?: boolean;
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

  const [selectedId, setSelectedId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredExpenses = expenses.filter((exp) => (exp.paid_by.toLowerCase().includes(search.toLocaleLowerCase()))
    || (exp.expense_type.toLowerCase().includes(search.toLocaleLowerCase())) || (exp.notes.toLowerCase().includes(search.toLocaleLowerCase()))
    || (exp.expense_session.toLowerCase().includes(search.toLocaleLowerCase())));

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);



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


  return (
    <>
      <DeleteExpense
        Deleteopen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        selectedExpenseId={selectedId}
        fetchExpenses={fetchExpenses} />

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <div className="flex justify-between items-center p-3 button-bg sticky top-0 z-10">
          <input
            type="text"
            placeholder="Search by expense type, session, or paid by"

            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-none rounded-lg px-3 py-2 w-full bg-white text-black"
          />
        </div>

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
            {currentExpenses.map((expense) => (
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

                <td className="p-3 font-semimedium">
                  ₹ {expense.amount}
                </td>

                <td className="p-3">{expense.notes}</td>
                {reports && <td className="p-3">
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
      <div className="flex justify-end items-center gap-2 mt-4 ">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 button-bg border border-none rounded-lg disabled:opacity-50"
        >
          <span className="flex gap-2 items-center"> <ArrowLeft size={18} />
            </span>
        </button>

        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 button-bg border border-none rounded-lg disabled:opacity-50"
        >
          <span className="flex gap-2 items-center"> 
            <ArrowRight size={18} /></span>
        </button>
      </div>

    </>
  );
}