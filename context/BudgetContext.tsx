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

type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  bills: Bill[];

  addCategory: (category: Category) => void;
  addTransaction: (transaction: Transaction) => void;
  addIncomeSource: (incomeSource: IncomeSource) => void;
  addBill: (bill: Bill) => void;

  deleteCategory: (id: string) => void;
  deleteTransaction: (id: string) => void;
  deleteIncomeSource: (id: string) => void;
  deleteBill: (id: string) => void;

  toggleBillPaid: (id: string) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [transactions, setTransactions] =
    useState<Transaction[]>(sampleTransactions);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem("categories");
    const savedTransactions = localStorage.getItem("transactions");
    const savedIncomeSources = localStorage.getItem("incomeSources");
    const savedBills = localStorage.getItem("bills");

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

  return (
    <BudgetContext.Provider
      value={{
        categories,
        transactions,
        incomeSources,
        bills,

        addCategory,
        addTransaction,
        addIncomeSource,
        addBill,

        deleteCategory,
        deleteTransaction,
        deleteIncomeSource,
        deleteBill,

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