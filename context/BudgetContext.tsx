"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bill } from "@/types/bill";
import type { Category } from "@/types/category";
import type { Goal } from "@/types/goal";
import type { IncomeSource } from "@/types/income";
import type { Transaction } from "@/types/transaction";

type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  bills: Bill[];
  goals: Goal[];

  addCategory: (category: Category) => Promise<void>;
  updateCategory: (
    updatedCategory: Category,
    previousName: string
  ) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  addIncomeSource: (incomeSource: IncomeSource) => Promise<void>;
  updateIncomeSource: (
    updatedIncomeSource: IncomeSource
  ) => Promise<void>;
  addBill: (bill: Bill) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (updatedGoal: Goal) => void;

  deleteCategory: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;
  deleteBill: (id: string) => void;
  deleteGoal: (id: string) => void;

  toggleBillPaid: (id: string) => Promise<void>;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hasLoadedLocalData, setHasLoadedLocalData] = useState(false);

  // Categories, transactions, and income now load from Supabase.
  // Bills and goals still use localStorage until we migrate them.
  useEffect(() => {
    async function loadBudgetData() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Unable to load budget user:", userError);
        setCategories([]);
        setTransactions([]);
        return;
      }

      const [
        categoriesResult,
        transactionsResult,
        incomeResult,
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, budget")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),

        supabase
          .from("transactions")
          .select("id, name, amount, category, date")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),

        supabase
          .from("income_sources")
          .select("id, source, amount, date")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);

      if (categoriesResult.error) {
        console.error(
          "Unable to load categories:",
          categoriesResult.error
        );
        
        setCategories([]);
      } else {
        setCategories(
          (categoriesResult.data ?? []) as Category[]
        );
      }

      if (transactionsResult.error) {
        console.error(
          "Unable to load transactions:",
          transactionsResult.error
        );

        setTransactions([]);
      } else {
        setTransactions(
          (transactionsResult.data ?? []) as Transaction[]
        );
      }

      if (incomeResult.error) {
        console.error(
          "Unable to load income sources:",
          incomeResult.error
        );

        setIncomeSources([]);
      } else {
        setIncomeSources(
          (incomeResult.data ?? []) as IncomeSource[]
        );
      }
    }

    void loadBudgetData();
  }, [supabase]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedBills = localStorage.getItem("bills");
    const savedGoals = localStorage.getItem("goals");

    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    setHasLoadedLocalData(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hasLoadedLocalData) return;
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills, hasLoadedLocalData]);

  useEffect(() => {
    if (!hasLoadedLocalData) return;
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals, hasLoadedLocalData]);

  async function getCurrentUserId() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("You must be logged in to change budget data.");
    }

    return user.id;
  }

  async function addCategory(category: Category) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("categories")
        .insert({
          id: category.id,
          user_id: userId,
          name: category.name,
          budget: category.budget,
        })
        .select("id, name, budget")
        .single();

      if (error) throw error;

      setCategories((currentCategories) => [
        ...currentCategories,
        data as Category,
      ]);
    } catch (error) {
      console.error("Unable to add category:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to add category."
      );
    }
  }

  async function updateCategory(
    updatedCategory: Category,
    previousName: string
  ) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("categories")
        .update({
          name: updatedCategory.name,
          budget: updatedCategory.budget,
        })
        .eq("id", updatedCategory.id)
        .eq("user_id", userId)
        .select("id, name, budget")
        .single();

      if (error) throw error;

      const savedCategory = data as Category;

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category.id === savedCategory.id ? savedCategory : category
        )
      );

      if (previousName !== savedCategory.name) {
        const { error: transactionError } = await supabase
          .from("transactions")
          .update({
            category: savedCategory.name,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("category", previousName);

        if (transactionError) throw transactionError;

        setTransactions((currentTransactions) =>
          currentTransactions.map((transaction) =>
            transaction.category === previousName
              ? { ...transaction, category: savedCategory.name }
              : transaction
          )
        );

        // Bills are still local until their Supabase migration.
        setBills((currentBills) =>
          currentBills.map((bill) =>
            bill.category === previousName
              ? { ...bill, category: savedCategory.name }
              : bill
          )
        );
      }
    } catch (error) {
      console.error("Unable to update category:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update category."
      );
    }
  }

  async function addTransaction(transaction: Transaction) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          id: transaction.id,
          user_id: userId,
          name: transaction.name,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,
        })
        .select("id, name, amount, category, date")
        .single();

      if (error) throw error;

      setTransactions((currentTransactions) => [
        data as Transaction,
        ...currentTransactions,
      ]);
    } catch (error) {
      console.error("Unable to add transaction:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add transaction."
      );
    }
  }

  async function updateTransaction(
    updatedTransaction: Transaction
  ) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("transactions")
        .update({
          name: updatedTransaction.name,
          amount: updatedTransaction.amount,
          category: updatedTransaction.category,
          date: updatedTransaction.date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedTransaction.id)
        .eq("user_id", userId)
        .select("id, name, amount, category, date")
        .single();

      if (error) throw error;

      const savedTransaction = data as Transaction;

      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === savedTransaction.id
            ? savedTransaction
            : transaction
        )
      );
    } catch (error) {
      console.error("Unable to update transaction:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update transaction."
      );
    }
  }

  async function addIncomeSource(incomeSource: IncomeSource) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("income_sources")
        .insert({
          id: incomeSource.id,
          user_id: userId,
          source: incomeSource.source,
          amount: incomeSource.amount,
          date: incomeSource.date,
        })
        .select("id, source, amount, date")
        .single();

      if (error) throw error;

      setIncomeSources((currentIncomeSources) => [
        data as IncomeSource,
        ...currentIncomeSources,
      ]);
    } catch (error) {
      console.error("Unable to add income source:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to add income source."
      );
    }
  }

  async function updateIncomeSource(
    updatedIncomeSource: IncomeSource
  ) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("income_sources")
        .update({
          source: updatedIncomeSource.source,
          amount: updatedIncomeSource.amount,
          date: updatedIncomeSource.date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedIncomeSource.id)
        .eq("user_id", userId)
        .select("id, source, amount, date")
        .single();

      if (error) throw error;

      const savedIncomeSource = data as IncomeSource;

      setIncomeSources((currentIncomeSources) =>
        currentIncomeSources.map((incomeSource) =>
          incomeSource.id === savedIncomeSource.id
            ? savedIncomeSource
            : incomeSource
        )
      );
    } catch (error) {
      console.error("Unable to update income source:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update income source."
      );
    }
  }

  function addBill(bill: Bill) {
    setBills((currentBills) => [...currentBills, bill]);
  }

  async function deleteCategory(id: string) {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setCategories((currentCategories) =>
        currentCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Unable to delete category:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete category."
      );
    }
  }

  async function deleteTransaction(id: string) {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== id
        )
      );
    } catch (error) {
      console.error("Unable to delete transaction:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete transaction."
      );
    }
  }

  async function deleteIncomeSource(id: string) {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase
        .from("income_sources")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setIncomeSources((currentIncomeSources) =>
        currentIncomeSources.filter(
          (incomeSource) => incomeSource.id !== id
        )
      );
    } catch (error) {
      console.error("Unable to delete income source:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete income source."
      );
    }
  }

  function deleteBill(id: string) {
    setBills((currentBills) =>
      currentBills.filter((bill) => bill.id !== id)
    );
  }

  async function toggleBillPaid(id: string) {
    const bill = bills.find((currentBill) => currentBill.id === id);

    if (!bill) return;

    try {
      const userId = await getCurrentUserId();

      if (!bill.isPaid) {
        const transactionId = crypto.randomUUID();

        const newTransaction: Transaction = {
          id: transactionId,
          name: bill.name,
          amount: -Math.abs(bill.amount),
          category: bill.category,
          date: new Date().toISOString().split("T")[0],
        };

        const { data, error } = await supabase
          .from("transactions")
          .insert({
            ...newTransaction,
            user_id: userId,
          })
          .select("id, name, amount, category, date")
          .single();

        if (error) throw error;

        setTransactions((currentTransactions) => [
          data as Transaction,
          ...currentTransactions,
        ]);

        setBills((currentBills) =>
          currentBills.map((currentBill) =>
            currentBill.id === id
              ? {
                  ...currentBill,
                  isPaid: true,
                  transactionId,
                }
              : currentBill
          )
        );

        return;
      }

      if (bill.transactionId) {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", bill.transactionId)
          .eq("user_id", userId);

        if (error) throw error;

        setTransactions((currentTransactions) =>
          currentTransactions.filter(
            (transaction) =>
              transaction.id !== bill.transactionId
          )
        );
      }

      setBills((currentBills) =>
        currentBills.map((currentBill) =>
          currentBill.id === id
            ? {
                ...currentBill,
                isPaid: false,
                transactionId: undefined,
              }
            : currentBill
        )
      );
    } catch (error) {
      console.error("Unable to toggle bill payment:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update the bill payment."
      );
    }
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