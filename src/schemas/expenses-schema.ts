import { z } from "zod";

const ExpensesSchema = z.object({
  expenseFor: z.string().min(3, "expenseFor must be at least 3 characters"),
  amount: z.number().positive("Amount must be a positive number"),
  date: z.string().datetime(),
  costCenterId: z.string().min(3, "Cost center ID must be at least 3 characters"),
});

type Expenses = z.infer<typeof ExpensesSchema>;

export { ExpensesSchema, type Expenses };
