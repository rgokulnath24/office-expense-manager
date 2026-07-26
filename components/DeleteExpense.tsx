import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DeleteExpenseProps {
    Deleteopen: boolean;
    setDeleteOpen: (open: boolean) => void;
      fetchExpenses: () => Promise<void>;
    selectedExpenseId: string;
}

export function DeleteExpense({ Deleteopen, setDeleteOpen, selectedExpenseId,fetchExpenses }: DeleteExpenseProps) {

    const handleDelete = async() => {

        const {error}=await supabase.from("expenses").update({is_deleted:1}).eq("id",selectedExpenseId);
        if (error) {
        toast.error(error.message);
        return;
    }

    toast.success("Expense Deleted");

    setDeleteOpen(false);

    await fetchExpenses();

    }
    return (
        <Dialog open={Deleteopen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-sm button-bg">
                <DialogHeader>
                    <DialogTitle>Delete Expense</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this expense?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="button-bg"
                        onClick={() => setDeleteOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        className="bg-red-700"
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
