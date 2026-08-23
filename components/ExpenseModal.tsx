"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2, Pencil, PlusCircle, Receipt } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense } from "@/types/expense";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddExpenseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchExpenses: () => Promise<void>;
  selectedExpenses: Expense | null;
}

export default function ExpenseModal({
  open,
  setOpen,
  fetchExpenses,
  selectedExpenses
}: AddExpenseProps) {

  const [loading, setLoading] = useState(false);
  const USERS = [
    "Gokul",
    "Pradeep",
    "Rajkumar",
    "Shivaranjith",
    "Prasath",
    "Malik",
    "Nithin",
  ];

  const SESSIONS = ["FN", "AN"];

  const [form, setForm] = useState({
    expense_type: "Tea",
    amount: 0,
    notes: "Cash",
    expense_date: new Date().toISOString().split("T")[0],
    paid_by: "",
    expense_session: "FN",
  });
  const [openPaidBy, setOpenPaidBy] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (selectedExpenses) {
      setForm({
        expense_type: selectedExpenses.expense_type,
        amount: Number(selectedExpenses.amount),
        notes: selectedExpenses.notes,
        expense_date: selectedExpenses.expense_date,
        paid_by: selectedExpenses.paid_by ?? "",
        expense_session: selectedExpenses.expense_session ?? "FN",
      });
    } else {
      setForm({
        expense_type: "Tea",
        amount: 0,
        notes: "Cash",
        expense_date: new Date().toISOString().split("T")[0],
        paid_by: "",
        expense_session: "FN",
      });
    }
  }, [selectedExpenses]);
  const handleSave = async () => {
    if (!form.amount) {
      toast.error("Enter Amount");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not found");
        return;
      }
      if (selectedExpenses) {
        const { error } = await supabase
          .from("expenses")
          .update({
            amount: Number(form.amount),
            expense_type: form.expense_type,
            notes: form.notes,
            expense_date: form.expense_date,
            paid_by: form.paid_by,
            expense_session: form.expense_session,
          })
          .eq("id", selectedExpenses.id);

        if (error) throw error;

        toast.success("Expense Updated Successfully");
      } else {
        const { error, data } = await supabase
          .from("expenses")
          .insert({
            user_id: user.id,
            amount: Number(form.amount),
            expense_type: form.expense_type,
            notes: form.notes,
            expense_date: form.expense_date,
            paid_by: form.paid_by,
            expense_session: form.expense_session,
          });
        console.log("Inserted Response", data)

        if (error) throw error;

        // toast.success("Expense Added Successfully");
      }

      await fetchExpenses();

      setForm({
        expense_type: "Tea",
        amount: 0,
        notes: "Cash",
        expense_date: new Date().toISOString().split("T")[0],
        paid_by: "",
        expense_session: "FN",
      });

      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md theme-bg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 font-medium tracking-wide">
  {selectedExpenses ? (
    <>
      <Pencil className="h-5 w-5" />
      Edit Expense
    </>
  ) : (
    <>
      <Receipt className="h-5 w-5" />
      Add Expense
    </>
  )}
</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Expense Date */}
          <div className="space-y-2">
            <label
              htmlFor="expense_date"
              className="text-sm font-medium text-gray-500"
            >
              Expense Date
            </label>

            <input
              id="expense_date"
              type="date"
              name="expense_date"
              value={form.expense_date}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 mt-2"
            />
          </div>

          {/* Expense Type */}
          <div className="space-y-2">
            <label
              htmlFor="expense_type"
              className="text-sm font-medium text-gray-500"
            >
              Expense Type
            </label>

            <select
              id="expense_type"
              name="expense_type"
              value={form.expense_type}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 mt-2"
            >
              <option>Tea</option>
              <option>Coffee</option>
              <option>Snacks</option>
              <option>Food</option>
              <option>Pooja</option>
              <option>Others</option>
            </select>
          </div>

          {/* Expense Session */}
          <div className="space-y-2">
            <label
              htmlFor="expense_session"
              className="text-sm font-medium text-gray-500"
            >
              Session
            </label>

            <select
              id="expense_session"
              name="expense_session"
              value={form.expense_session}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 mt-2"
            >
              {SESSIONS.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 ">
              Paid By
            </label>

            <Popover open={openPaidBy} onOpenChange={setOpenPaidBy}>
              <PopoverTrigger
                className="flex w-full items-center justify-between rounded-lg border px-3 py-2 cursor-pointer mt-2"
              >
                <span>{form.paid_by || "Select Paid By"}</span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </PopoverTrigger>

              <PopoverContent className="w-[var(--anchor-width)] p-0">
                <Command className="theme-bg">
                  <CommandInput placeholder="Search user..." />

                  <CommandEmpty>No user found.</CommandEmpty>

                  <CommandGroup>
                    {USERS.map((user) => (
                      <CommandItem
                        key={user}
                        value={user}
                        onSelect={(value) => {
                          setForm((prev) => ({
                            ...prev,
                            paid_by: value,
                          }));
                          setOpenPaidBy(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.paid_by === user
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {user}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-500 "
            >
              Amount
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={form.amount === 0 ? "" : form.amount}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 mt-2"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-500"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              placeholder="Enter notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-lg border p-2 mt-2"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-lg button-bg py-2 text-white text-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Saving...
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : (
              `${selectedExpenses ? "Edit Expense" : "Save Expense"}`
            )}
          </button>

        </div>
      </DialogContent>
    </Dialog>
  );
}