import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";

export const sampleCategories: Category[] = [
  { id: "groceries", name: "Groceries", budget: 600 },
  { id: "gas", name: "Gas", budget: 250 },
  { id: "eating-out", name: "Eating Out", budget: 200 },
  { id: "bills", name: "Bills", budget: 1800 },
];

export const sampleTransactions: Transaction[] = [
  {
    id: "t1",
    name: "Walmart",
    category: "Groceries",
    amount: 82.43,
  },
  {
    id: "t2",
    name: "Shell",
    category: "Gas",
    amount: 46.10,
  },
  {
    id: "t3",
    name: "Amazon",
    category: "Shopping",
    amount: 27.99,
  },
];