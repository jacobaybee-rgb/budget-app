"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sampleCategories, sampleTransactions } from "@/data/sampleData";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";

export type IncomeSource = {
  id: string;
  source: string;
  amount: number;
  date: string;
};

type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  addCategory: (category: Category) => void;
  addTransaction: (transaction: Transaction) => void;
  addIncomeSource: (incomeSource: IncomeSource) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [transactions, setTransactions] =
    useState<Transaction[]>(sampleTransactions);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem("categories");
    const savedTransactions = localStorage.getItem("transactions");
    const savedIncomeSources = localStorage.getItem("incomeSources");

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedIncomeSources) {
      setIncomeSources(JSON.parse(savedIncomeSources));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("incomeSources", JSON.stringify(incomeSources));
  }, [incomeSources]);

  function addCategory(category: Category) {
    setCategories((currentCategories) => [...currentCategories, category]);
  }

  function addTransaction(transaction: Transaction) {
    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);
  }

  function addIncomeSource(incomeSource: IncomeSource) {
    setIncomeSources((currentIncomeSources) => [
      ...currentIncomeSources,
      incomeSource,
    ]);
  }

  return (
    <BudgetContext.Provider
      value={{
        categories,
        transactions,
        incomeSources,
        addCategory,
        addTransaction,
        addIncomeSource,
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