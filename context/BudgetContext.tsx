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
import type {
  IncomeSource,
  IncomeTemplate,
} from "@/types/income";
import type { Transaction } from "@/types/transaction";

type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  bills: Bill[];
  goals: Goal[];

  selectedMonthStart: string;
  budgetMonthId: string | null;
  isBudgetLoading: boolean;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;

  addCategory: (category: Category) => Promise<void>;
  updateCategory: (
    updatedCategory: Category,
    previousName: string
  ) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  addIncomeSource: (incomeSource: IncomeSource) => Promise<void>;
  addIncomeTemplate: (
    incomeTemplate: IncomeTemplate
  ) => Promise<void>;
  updateIncomeSource: (
    updatedIncomeSource: IncomeSource
  ) => Promise<void>;
  addBill: (bill: Bill) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (updatedGoal: Goal) => Promise<void>;

  deleteCategory: (id: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  toggleBillPaid: (id: string) => Promise<void>;
};

type BudgetMonthRecord = {
  id: string;
  month_start: string;
};

type CategoryRecord = {
  id: string;
  name: string;
  budget: number | string;
};

type CategoryMonthBudgetRecord = {
  category_id: string;
  budget: number | string;
};

type IncomeTemplateRecord = {
  id: string;
  source: string;
  amount: number | string;
  recurring_day: number;
  start_month: string;
  is_active: boolean;
};

type BillRecord = {
  id: string;
  name: string;
  amount: number | string;
  due_day: number;
  category: string;
};

type BillPaymentRecord = {
  bill_id: string;
  is_paid: boolean;
  transaction_id: string | null;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

function getCurrentMonthStart() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
}

function shiftMonth(monthStart: string, amount: number) {
  const [year, month] = monthStart.split("-").map(Number);
  const shiftedDate = new Date(year, month - 1 + amount, 1);

  return [
    shiftedDate.getFullYear(),
    String(shiftedDate.getMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
}

function getMonthRange(monthStart: string) {
  return {
    start: monthStart,
    end: shiftMonth(monthStart, 1),
  };
}

function getDateInsideMonth(
  monthStart: string,
  preferredDay: number
) {
  const [year, month] = monthStart.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const safeDay = Math.min(Math.max(preferredDay, 1), lastDay);

  return [
    year,
    String(month).padStart(2, "0"),
    String(safeDay).padStart(2, "0"),
  ].join("-");
}

function moveDateToMonth(date: string, monthStart: string) {
  const preferredDay = Number(date.split("-")[2]);

  return getDateInsideMonth(
    monthStart,
    Number.isFinite(preferredDay) ? preferredDay : 1
  );
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [selectedMonthStart, setSelectedMonthStart] = useState(
    getCurrentMonthStart
  );
  const [budgetMonthId, setBudgetMonthId] = useState<string | null>(
    null
  );
  const [isBudgetLoading, setIsBudgetLoading] = useState(true);


  useEffect(() => {
    let isCancelled = false;

    async function loadBudgetData() {
      setIsBudgetLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Unable to load budget user:", userError);

        if (!isCancelled) {
          setCategories([]);
          setTransactions([]);
          setIncomeSources([]);
          setBills([]);
          setGoals([]);
          setBudgetMonthId(null);
          setIsBudgetLoading(false);
        }

        return;
      }

      const { start, end } = getMonthRange(selectedMonthStart);

      const [
        categoriesResult,
        billsResult,
        transactionsResult,
        incomeResult,
        incomeTemplatesResult,
        goalsResult,
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, budget")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),

        supabase
          .from("bills")
          .select("id, name, amount, due_day, category")
          .eq("user_id", user.id)
          .order("due_day", { ascending: true }),

        supabase
          .from("transactions")
          .select("id, name, amount, category, date")
          .eq("user_id", user.id)
          .gte("date", start)
          .lt("date", end)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),

        supabase
          .from("income_sources")
          .select("id, source, amount, date, income_template_id")
          .eq("user_id", user.id)
          .gte("date", start)
          .lt("date", end)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),

        supabase
          .from("income_templates")
          .select(
            "id, source, amount, recurring_day, start_month, is_active"
          )
          .eq("user_id", user.id)
          .eq("is_active", true)
          .lte("start_month", selectedMonthStart),

        supabase
          .from("goals")
          .select(
            "id, name, target_amount, current_amount, target_date"
          )
          .eq("user_id", user.id)
          .order("target_date", { ascending: true })
          .order("created_at", { ascending: true }),
      ]);

      if (categoriesResult.error) {
        console.error(
          "Unable to load categories:",
          categoriesResult.error
        );
      }

      if (billsResult.error) {
        console.error("Unable to load bills:", billsResult.error);
      }

      if (transactionsResult.error) {
        console.error(
          "Unable to load transactions:",
          transactionsResult.error
        );
      }

      if (incomeResult.error) {
        console.error(
          "Unable to load income sources:",
          incomeResult.error
        );
      }

      if (incomeTemplatesResult.error) {
        console.error(
          "Unable to load recurring income templates:",
          incomeTemplatesResult.error
        );
      }

      if (goalsResult.error) {
        console.error("Unable to load goals:", goalsResult.error);
      }

      const activeIncomeTemplates = (
        incomeTemplatesResult.data ?? []
      ) as IncomeTemplateRecord[];

      if (activeIncomeTemplates.length > 0) {
        const recurringIncomeRows = activeIncomeTemplates.map(
          (template) => ({
            id: crypto.randomUUID(),
            user_id: user.id,
            income_template_id: template.id,
            source: template.source,
            amount: Number(template.amount),
            date: getDateInsideMonth(
              selectedMonthStart,
              template.recurring_day
            ),
          })
        );

        const { error: recurringIncomeError } = await supabase
          .from("income_sources")
          .upsert(recurringIncomeRows, {
            onConflict: "income_template_id,date",
            ignoreDuplicates: true,
          });

        if (recurringIncomeError) {
          console.error(
            "Unable to generate recurring income:",
            recurringIncomeError
          );
        }
      }

      const {
        data: refreshedIncomeData,
        error: refreshedIncomeError,
      } = await supabase
        .from("income_sources")
        .select(
          "id, source, amount, date, income_template_id"
        )
        .eq("user_id", user.id)
        .gte("date", start)
        .lt("date", end)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (refreshedIncomeError) {
        console.error(
          "Unable to refresh generated income:",
          refreshedIncomeError
        );
      }

      const baseCategories = (
        (categoriesResult.data ?? []) as CategoryRecord[]
      );

      const baseBills = (billsResult.data ?? []) as BillRecord[];

      const { data: monthData, error: monthError } = await supabase
        .from("budget_months")
        .upsert(
          {
            user_id: user.id,
            month_start: selectedMonthStart,
            status: "open",
          },
          {
            onConflict: "user_id,month_start",
            ignoreDuplicates: false,
          }
        )
        .select("id, month_start")
        .single();

      if (monthError) {
        console.error("Unable to load budget month:", monthError);

        if (!isCancelled) {
          setCategories([]);
          setTransactions([]);
          setIncomeSources([]);
          setBills([]);
          setGoals([]);
          setBudgetMonthId(null);
          setIsBudgetLoading(false);
        }

        return;
      }

      const budgetMonth = monthData as BudgetMonthRecord;

      if (baseCategories.length > 0) {
        const { error: categorySeedError } = await supabase
          .from("category_month_budgets")
          .upsert(
            baseCategories.map((category) => ({
              user_id: user.id,
              budget_month_id: budgetMonth.id,
              category_id: category.id,
              budget: Number(category.budget),
            })),
            {
              onConflict: "budget_month_id,category_id",
              ignoreDuplicates: true,
            }
          );

        if (categorySeedError) {
          console.error(
            "Unable to seed monthly category budgets:",
            categorySeedError
          );
        }
      }

      if (baseBills.length > 0) {
        const { error: billSeedError } = await supabase
          .from("bill_payments")
          .upsert(
            baseBills.map((bill) => ({
              user_id: user.id,
              budget_month_id: budgetMonth.id,
              bill_id: bill.id,
              is_paid: false,
              transaction_id: null,
              paid_at: null,
            })),
            {
              onConflict: "budget_month_id,bill_id",
              ignoreDuplicates: true,
            }
          );

        if (billSeedError) {
          console.error(
            "Unable to seed monthly bill payments:",
            billSeedError
          );
        }
      }

      const [
        categoryBudgetsResult,
        billPaymentsResult,
      ] = await Promise.all([
        supabase
          .from("category_month_budgets")
          .select("category_id, budget")
          .eq("user_id", user.id)
          .eq("budget_month_id", budgetMonth.id),

        supabase
          .from("bill_payments")
          .select("bill_id, is_paid, transaction_id")
          .eq("user_id", user.id)
          .eq("budget_month_id", budgetMonth.id),
      ]);

      if (categoryBudgetsResult.error) {
        console.error(
          "Unable to load monthly category budgets:",
          categoryBudgetsResult.error
        );
      }

      if (billPaymentsResult.error) {
        console.error(
          "Unable to load monthly bill payments:",
          billPaymentsResult.error
        );
      }

      const monthlyBudgetByCategory = new Map(
        (
          (categoryBudgetsResult.data ??
            []) as CategoryMonthBudgetRecord[]
        ).map((record) => [
          record.category_id,
          Number(record.budget),
        ])
      );

      const monthlyPaymentByBill = new Map(
        (
          (billPaymentsResult.data ?? []) as BillPaymentRecord[]
        ).map((record) => [record.bill_id, record])
      );

      const loadedCategories: Category[] = baseCategories.map(
        (category) => ({
          id: category.id,
          name: category.name,
          budget:
            monthlyBudgetByCategory.get(category.id) ??
            Number(category.budget),
        })
      );

      const loadedBills: Bill[] = baseBills.map((bill) => {
        const payment = monthlyPaymentByBill.get(bill.id);

        return {
          id: bill.id,
          name: bill.name,
          amount: Number(bill.amount),
          dueDay: bill.due_day,
          category: bill.category,
          isPaid: payment?.is_paid ?? false,
          transactionId: payment?.transaction_id ?? undefined,
        };
      });

      const loadedGoals: Goal[] = (
        goalsResult.data ?? []
      ).map((goal) => ({
        id: goal.id,
        name: goal.name,
        targetAmount: Number(goal.target_amount),
        currentAmount: Number(goal.current_amount),
        targetDate: goal.target_date,
      }));

      if (!isCancelled) {
        setBudgetMonthId(budgetMonth.id);
        setCategories(loadedCategories);
        setBills(loadedBills);
        setTransactions(
          (transactionsResult.data ?? []) as Transaction[]
        );
        setIncomeSources(
          (refreshedIncomeData ?? []).map((income) => ({
            id: income.id,
            source: income.source,
            amount: Number(income.amount),
            date: income.date,
            incomeTemplateId:
              income.income_template_id ?? undefined,
          }))
        );
        setGoals(loadedGoals);
        setIsBudgetLoading(false);
      }
    }

    void loadBudgetData();

    return () => {
      isCancelled = true;
    };
  }, [selectedMonthStart, supabase]);

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

  function requireBudgetMonthId() {
    if (!budgetMonthId) {
      throw new Error("The selected budget month is not ready yet.");
    }

    return budgetMonthId;
  }

  function goToPreviousMonth() {
    setSelectedMonthStart((currentMonth) =>
      shiftMonth(currentMonth, -1)
    );
  }

  function goToNextMonth() {
    setSelectedMonthStart((currentMonth) =>
      shiftMonth(currentMonth, 1)
    );
  }

  function goToCurrentMonth() {
    setSelectedMonthStart(getCurrentMonthStart());
  }

  async function addCategory(category: Category) {
    try {
      const userId = await getCurrentUserId();
      const monthId = requireBudgetMonthId();

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

      const { error: monthlyBudgetError } = await supabase
        .from("category_month_budgets")
        .insert({
          user_id: userId,
          budget_month_id: monthId,
          category_id: data.id,
          budget: category.budget,
        });

      if (monthlyBudgetError) {
        await supabase
          .from("categories")
          .delete()
          .eq("id", data.id)
          .eq("user_id", userId);

        throw monthlyBudgetError;
      }

      setCategories((currentCategories) => [
        ...currentCategories,
        {
          id: data.id,
          name: data.name,
          budget: Number(category.budget),
        },
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
      const monthId = requireBudgetMonthId();
      const { start, end } = getMonthRange(selectedMonthStart);

      const { data, error } = await supabase
        .from("categories")
        .update({
          name: updatedCategory.name,
          budget: updatedCategory.budget,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedCategory.id)
        .eq("user_id", userId)
        .select("id, name, budget")
        .single();

      if (error) throw error;

      const { error: monthlyBudgetError } = await supabase
        .from("category_month_budgets")
        .upsert(
          {
            user_id: userId,
            budget_month_id: monthId,
            category_id: updatedCategory.id,
            budget: updatedCategory.budget,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "budget_month_id,category_id",
          }
        );

      if (monthlyBudgetError) throw monthlyBudgetError;

      const savedCategory: Category = {
        id: data.id,
        name: data.name,
        budget: Number(updatedCategory.budget),
      };

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
          .eq("category", previousName)
          .gte("date", start)
          .lt("date", end);

        if (transactionError) throw transactionError;

        const { error: billsError } = await supabase
          .from("bills")
          .update({
            category: savedCategory.name,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("category", previousName);

        if (billsError) throw billsError;

        setTransactions((currentTransactions) =>
          currentTransactions.map((transaction) =>
            transaction.category === previousName
              ? { ...transaction, category: savedCategory.name }
              : transaction
          )
        );

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

      const transactionDate = moveDateToMonth(
        transaction.date,
        selectedMonthStart
      );

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          id: transaction.id,
          user_id: userId,
          name: transaction.name,
          amount: transaction.amount,
          category: transaction.category,
          date: transactionDate,
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

      const transactionDate = moveDateToMonth(
        updatedTransaction.date,
        selectedMonthStart
      );

      const { data, error } = await supabase
        .from("transactions")
        .update({
          name: updatedTransaction.name,
          amount: updatedTransaction.amount,
          category: updatedTransaction.category,
          date: transactionDate,
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

      const incomeDate = moveDateToMonth(
        incomeSource.date,
        selectedMonthStart
      );

      const { data, error } = await supabase
        .from("income_sources")
        .insert({
          id: incomeSource.id,
          user_id: userId,
          source: incomeSource.source,
          amount: incomeSource.amount,
          date: incomeDate,
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

  async function addIncomeTemplate(
    incomeTemplate: IncomeTemplate
  ) {
    try {
      const userId = await getCurrentUserId();

      const { data: templateData, error: templateError } =
        await supabase
          .from("income_templates")
          .insert({
            id: incomeTemplate.id,
            user_id: userId,
            source: incomeTemplate.source,
            amount: incomeTemplate.amount,
            frequency: incomeTemplate.frequency,
            recurring_day: incomeTemplate.recurringDay,
            start_month: selectedMonthStart,
            is_active: incomeTemplate.isActive,
          })
          .select(
            "id, source, amount, recurring_day, start_month, is_active"
          )
          .single();

      if (templateError) throw templateError;

      const recurringDate = getDateInsideMonth(
        selectedMonthStart,
        templateData.recurring_day
      );

      const { data: incomeData, error: incomeError } =
        await supabase
          .from("income_sources")
          .insert({
            id: crypto.randomUUID(),
            user_id: userId,
            income_template_id: templateData.id,
            source: templateData.source,
            amount: Number(templateData.amount),
            date: recurringDate,
          })
          .select(
            "id, source, amount, date, income_template_id"
          )
          .single();

      if (incomeError) {
        await supabase
          .from("income_templates")
          .delete()
          .eq("id", templateData.id)
          .eq("user_id", userId);

        throw incomeError;
      }

      const savedIncome: IncomeSource = {
        id: incomeData.id,
        source: incomeData.source,
        amount: Number(incomeData.amount),
        date: incomeData.date,
        incomeTemplateId:
          incomeData.income_template_id ?? undefined,
      };

      setIncomeSources((currentIncomeSources) => [
        savedIncome,
        ...currentIncomeSources,
      ]);
    } catch (error) {
      console.error("Unable to add recurring income:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add recurring income."
      );

      throw error;
    }
  }

  async function updateIncomeSource(
    updatedIncomeSource: IncomeSource
  ) {
    try {
      const userId = await getCurrentUserId();

      const incomeDate = moveDateToMonth(
        updatedIncomeSource.date,
        selectedMonthStart
      );

      const { data, error } = await supabase
        .from("income_sources")
        .update({
          source: updatedIncomeSource.source,
          amount: updatedIncomeSource.amount,
          date: incomeDate,
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

  async function addBill(bill: Bill) {
    try {
      const userId = await getCurrentUserId();
      const monthId = requireBudgetMonthId();

      const { data, error } = await supabase
        .from("bills")
        .insert({
          id: bill.id,
          user_id: userId,
          name: bill.name,
          amount: bill.amount,
          due_day: bill.dueDay,
          category: bill.category,
          is_paid: false,
          transaction_id: null,
        })
        .select("id, name, amount, due_day, category")
        .single();

      if (error) throw error;

      const { error: paymentError } = await supabase
        .from("bill_payments")
        .insert({
          user_id: userId,
          budget_month_id: monthId,
          bill_id: data.id,
          is_paid: false,
          transaction_id: null,
          paid_at: null,
        });

      if (paymentError) {
        await supabase
          .from("bills")
          .delete()
          .eq("id", data.id)
          .eq("user_id", userId);

        throw paymentError;
      }

      const savedBill: Bill = {
        id: data.id,
        name: data.name,
        amount: Number(data.amount),
        dueDay: data.due_day,
        category: data.category,
        isPaid: false,
        transactionId: undefined,
      };

      setBills((currentBills) =>
        [...currentBills, savedBill].sort(
          (firstBill, secondBill) =>
            firstBill.dueDay - secondBill.dueDay
        )
      );
    } catch (error) {
      console.error("Unable to add bill:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add bill."
      );

      throw error;
    }
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

      setBills((currentBills) =>
        currentBills.map((bill) =>
          bill.transactionId === id
            ? {
                ...bill,
                isPaid: false,
                transactionId: undefined,
              }
            : bill
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

      const incomeToDelete = incomeSources.find(
        (incomeSource) => incomeSource.id === id
      );

      if (!incomeToDelete) return;

      // Recurring income:
      // Delete all generated entries and then delete the template.
      if (incomeToDelete.incomeTemplateId) {
        const templateId = incomeToDelete.incomeTemplateId;

        const { error: incomeEntriesError } = await supabase
          .from("income_sources")
          .delete()
          .eq("user_id", userId)
          .eq("income_template_id", templateId);

        if (incomeEntriesError) throw incomeEntriesError;

        const { error: templateError } = await supabase
          .from("income_templates")
          .delete()
          .eq("id", templateId)
          .eq("user_id", userId);

        if (templateError) throw templateError;

        setIncomeSources((currentIncomeSources) =>
          currentIncomeSources.filter(
            (incomeSource) =>
              incomeSource.incomeTemplateId !== templateId
          )
        );

        return;
      }

      // One-time income:
      // Delete only this individual entry.
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

  async function deleteBill(id: string) {
    try {
      const userId = await getCurrentUserId();

      const paymentTransactionIds = bills
        .filter((bill) => bill.id === id && bill.transactionId)
        .map((bill) => bill.transactionId as string);

      if (paymentTransactionIds.length > 0) {
        const { error: transactionError } = await supabase
          .from("transactions")
          .delete()
          .in("id", paymentTransactionIds)
          .eq("user_id", userId);

        if (transactionError) throw transactionError;
      }

      const { error } = await supabase
        .from("bills")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setBills((currentBills) =>
        currentBills.filter((bill) => bill.id !== id)
      );

      if (paymentTransactionIds.length > 0) {
        setTransactions((currentTransactions) =>
          currentTransactions.filter(
            (transaction) =>
              !paymentTransactionIds.includes(transaction.id)
          )
        );
      }
    } catch (error) {
      console.error("Unable to delete bill:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete bill."
      );
    }
  }

  async function toggleBillPaid(id: string) {
    const bill = bills.find((currentBill) => currentBill.id === id);

    if (!bill) return;

    try {
      const userId = await getCurrentUserId();
      const monthId = requireBudgetMonthId();

      if (!bill.isPaid) {
        const transactionId = crypto.randomUUID();
        const transactionDate = getDateInsideMonth(
          selectedMonthStart,
          bill.dueDay
        );

        const newTransaction: Transaction = {
          id: transactionId,
          name: bill.name,
          amount: -Math.abs(bill.amount),
          category: bill.category,
          date: transactionDate,
        };

        const { data: transactionData, error: transactionError } =
          await supabase
            .from("transactions")
            .insert({
              id: newTransaction.id,
              user_id: userId,
              name: newTransaction.name,
              amount: newTransaction.amount,
              category: newTransaction.category,
              date: newTransaction.date,
            })
            .select("id, name, amount, category, date")
            .single();

        if (transactionError) throw transactionError;

        const { error: paymentError } = await supabase
          .from("bill_payments")
          .upsert(
            {
              user_id: userId,
              budget_month_id: monthId,
              bill_id: bill.id,
              transaction_id: transactionId,
              is_paid: true,
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "budget_month_id,bill_id",
            }
          );

        if (paymentError) {
          await supabase
            .from("transactions")
            .delete()
            .eq("id", transactionId)
            .eq("user_id", userId);

          throw paymentError;
        }

        setTransactions((currentTransactions) => [
          transactionData as Transaction,
          ...currentTransactions,
        ]);

        setBills((currentBills) =>
          currentBills.map((currentBill) =>
            currentBill.id === bill.id
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

      const { error: paymentError } = await supabase
        .from("bill_payments")
        .update({
          transaction_id: null,
          is_paid: false,
          paid_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("budget_month_id", monthId)
        .eq("bill_id", bill.id);

      if (paymentError) throw paymentError;

      if (bill.transactionId) {
        const { error: transactionError } = await supabase
          .from("transactions")
          .delete()
          .eq("id", bill.transactionId)
          .eq("user_id", userId);

        if (transactionError) throw transactionError;
      }

      setBills((currentBills) =>
        currentBills.map((currentBill) =>
          currentBill.id === bill.id
            ? {
                ...currentBill,
                isPaid: false,
                transactionId: undefined,
              }
            : currentBill
        )
      );

      if (bill.transactionId) {
        setTransactions((currentTransactions) =>
          currentTransactions.filter(
            (transaction) =>
              transaction.id !== bill.transactionId
          )
        );
      }
    } catch (error) {
      console.error("Unable to toggle bill payment:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update the bill payment."
      );
    }
  }

  async function addGoal(goal: Goal) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("goals")
        .insert({
          id: goal.id,
          user_id: userId,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate,
        })
        .select(
          "id, name, target_amount, current_amount, target_date"
        )
        .single();

      if (error) throw error;

      const savedGoal: Goal = {
        id: data.id,
        name: data.name,
        targetAmount: Number(data.target_amount),
        currentAmount: Number(data.current_amount),
        targetDate: data.target_date,
      };

      setGoals((currentGoals) =>
        [...currentGoals, savedGoal].sort((firstGoal, secondGoal) =>
          firstGoal.targetDate.localeCompare(secondGoal.targetDate)
        )
      );
    } catch (error) {
      console.error("Unable to add goal:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add goal."
      );

      throw error;
    }
  }

  async function updateGoal(updatedGoal: Goal) {
    try {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from("goals")
        .update({
          name: updatedGoal.name,
          target_amount: updatedGoal.targetAmount,
          current_amount: updatedGoal.currentAmount,
          target_date: updatedGoal.targetDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedGoal.id)
        .eq("user_id", userId)
        .select(
          "id, name, target_amount, current_amount, target_date"
        )
        .single();

      if (error) throw error;

      const savedGoal: Goal = {
        id: data.id,
        name: data.name,
        targetAmount: Number(data.target_amount),
        currentAmount: Number(data.current_amount),
        targetDate: data.target_date,
      };

      setGoals((currentGoals) =>
        currentGoals
          .map((goal) =>
            goal.id === savedGoal.id ? savedGoal : goal
          )
          .sort((firstGoal, secondGoal) =>
            firstGoal.targetDate.localeCompare(secondGoal.targetDate)
          )
      );
    } catch (error) {
      console.error("Unable to update goal:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update goal."
      );

      throw error;
    }
  }

  async function deleteGoal(id: string) {
    try {
      const userId = await getCurrentUserId();

      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setGoals((currentGoals) =>
        currentGoals.filter((goal) => goal.id !== id)
      );
    } catch (error) {
      console.error("Unable to delete goal:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete goal."
      );

      throw error;
    }
  }

  return (
    <BudgetContext.Provider
      value={{
        categories,
        transactions,
        incomeSources,
        bills,
        goals,

        selectedMonthStart,
        budgetMonthId,
        isBudgetLoading,
        goToPreviousMonth,
        goToNextMonth,
        goToCurrentMonth,

        addCategory,
        updateCategory,
        addTransaction,
        updateTransaction,
        addIncomeSource,
        updateIncomeSource,
        addIncomeTemplate,
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