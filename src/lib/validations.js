import { z } from "zod"

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health & Medical",
  "Housing",
  "Education",
  "Travel",
  "Other",
]

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  date: z.string().min(1, "Date is required"),
  description: z.string().max(500).optional().or(z.literal("")),
})

