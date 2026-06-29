import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";

export const sampleCategories: Category[] = [
  { id: "groceries", name: "Groceries", budget: 600, spent: 248 },
  { id: "gas", name: "Gas", budget: 250, spent: 92 },
  { id: "eating-out", name: "Eating Out", budget: 200, spent: 141 },
  { id: "bills", name: "Bills", budget: 1800, spent: 1800 },
];

export const sampleTransactions: Transaction[] = [
  { name: "Walmart", category: "Groceries", amount: 82.43 },
  { name: "Shell", category: "Gas", amount: 46.1 },
  { name: "Amazon", category: "Shopping", amount: 27.99 },
];