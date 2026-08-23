export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  expense_type: string;
  notes: string;
  expense_date: string;
  paid_by:string;
  expense_session:string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}
