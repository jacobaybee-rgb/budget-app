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

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  transactionId?: string;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
};

type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  bills: Bill[];
  goals: Goal[];

  addCategory: (category: Category) => void;
  updateCategory: (
    updatedCategory: Category,
    previousName: string
  ) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  addIncomeSource: (incomeSource: IncomeSource) => void;
  updateIncomeSource: (updatedIncomeSource: IncomeSource) => void;
  addBill: (bill: Bill) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (updatedGoal: Goal) => void;

  deleteCategory: (id: string) => void;
  deleteTransaction: (id: string) => void;
  deleteIncomeSource: (id: string) => void;
  deleteBill: (id: string) => void;
  deleteGoal: (id: string) => void;

  toggleBillPaid: (id: string) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [transactions, setTransactions] =
    useState<Transaction[]>(sampleTransactions);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem("categories");
    const savedTransactions = localStorage.getItem("transactions");
    const savedIncomeSources = localStorage.getItem("incomeSources");
    const savedBills = localStorage.getItem("bills");
    const savedGoals = localStorage.getItem("goals");

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedIncomeSources) {
      setIncomeSources(JSON.parse(savedIncomeSources));
    }

    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
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

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  function addCategory(category: Category) {
    setCategories((currentCategories) => [...currentCategories, category]);
  }

  function updateCategory(
    updatedCategory: Category,
    previousName: string
  ) {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === updatedCategory.id
          ? updatedCategory
          : category
      )
    );

    if (previousName !== updatedCategory.name) {
      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.category === previousName
            ? {
                ...transaction,
                category: updatedCategory.name,
              }
            : transaction
        )
      );

      setBills((currentBills) =>
        currentBills.map((bill) =>
          bill.category === previousName
            ? {
                ...bill,
                category: updatedCategory.name,
              }
            : bill
        )
      );
    }
  }

  function addTransaction(transaction: Transaction) {
    setTransactions((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);
  }

  function updateTransaction(updatedTransaction: Transaction) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );
  }

  function addIncomeSource(incomeSource: IncomeSource) {
    setIncomeSources((currentIncomeSources) => [
      ...currentIncomeSources,
      incomeSource,
    ]);
  }

  function updateIncomeSource(updatedIncomeSource: IncomeSource) {
    setIncomeSources((currentIncomeSources) =>
      currentIncomeSources.map((incomeSource) =>
        incomeSource.id === updatedIncomeSource.id
          ? updatedIncomeSource
          : incomeSource
      )
    );
  }

  function addBill(bill: Bill) {
    setBills((currentBills) => [...currentBills, bill]);
  }

  function deleteCategory(id: string) {
    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== id)
    );
  }

  function deleteTransaction(id: string) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );
  }

  function deleteIncomeSource(id: string) {
    setIncomeSources((currentIncomeSources) =>
      currentIncomeSources.filter((incomeSource) => incomeSource.id !== id)
    );
  }

  function deleteBill(id: string) {
    setBills((currentBills) =>
      currentBills.filter((bill) => bill.id !== id)
    );
  }

  function toggleBillPaid(id: string) {
    const bill = bills.find((currentBill) => currentBill.id === id);

    if (!bill) {
      return;
    }

    if (!bill.isPaid) {
      const transactionId = crypto.randomUUID();

      const newTransaction: Transaction = {
        id: transactionId,
        name: bill.name,
        amount: -Math.abs(bill.amount),
        category: bill.category,
        date: new Date().toISOString().split("T")[0],
      };

      setTransactions((currentTransactions) => [
        ...currentTransactions,
        newTransaction,
      ]);

      setBills((currentBills) =>
        currentBills.map((currentBill) =>
          currentBill.id === id
            ? { ...currentBill, isPaid: true, transactionId }
            : currentBill
        )
      );

      return;
    }

    if (bill.transactionId) {
      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== bill.transactionId
        )
      );
    }

    setBills((currentBills) =>
      currentBills.map((currentBill) =>
        currentBill.id === id
          ? { ...currentBill, isPaid: false, transactionId: undefined }
          : currentBill
      )
    );
  }

  function addGoal(goal: Goal) {
    setGoals((currentGoals) => [...currentGoals, goal]);
  }

  function updateGoal(updatedGoal: Goal) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
  }

  function deleteGoal(id: string) {
    setGoals((currentGoals) =>
      currentGoals.filter((goal) => goal.id !== id)
    );
  }

  return (
    <BudgetContext.Provider
      value={{
        categories,
        transactions,
        incomeSources,
        bills,
        goals,

        addCategory,
        updateCategory,
        addTransaction,
        updateTransaction,
        addIncomeSource,
        updateIncomeSource,
        addBill,
        addGoal,
        updateGoal,

        deleteCategory,
        deleteTransaction,
        deleteIncomeSource,
        deleteBill,
        deleteGoal,

        toggleBillPaid,
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