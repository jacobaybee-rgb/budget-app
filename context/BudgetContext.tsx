"use client";

import { createContext, useContext, useState } from "react";
import { sampleCategories, sampleTransactions } from "@/data/sampleData";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";

type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  addCategory: (category: Category) => void;
  addTransaction: (transaction: Transaction) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [transactions, setTransactions] =
    useState<Transaction[]>(sampleTransactions);

  function addCategory(category: Category) {
    setCategories((currentCategories) => [...currentCategories, category]);
  }

  function addTransaction(transaction: Transaction) {
    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);
  }

  return (
    <BudgetContext.Provider
      value={{
        categories,
        transactions,
        addCategory,
        addTransaction,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error("useBudget must be used inside BudgetProvider");
  }

  return context;
}