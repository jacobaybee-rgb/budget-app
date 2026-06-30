import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";

export function getCategorySpent(
  category: Category,
  transactions: Transaction[]
) {
  return transactions
    .filter(
      (transaction) => transaction.category === category.name
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
}

export function getCategoryRemaining(
  category: Category,
  transactions: Transaction[]
) {
  return category.budget - getCategorySpent(category, transactions);
}