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
  budgetMonthStatus: BudgetMonthStatus;
  budgetMonths: BudgetMonthSummary[];
  closedAt: string | null;
  closingBalance: number | null;
  carryoverReceived: number;
  savingsBalance: number;
  isBudgetLoading: boolean;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
  goToMonth: (monthStart: string) => void;

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

  closeBudgetMonth: (
    allocations: MonthEndAllocationInput[]
  ) => Promise<void>;
};

type BudgetMonthStatus = "open" | "closed";

export type BudgetMonthSummary = {
  monthStart: string;
  status: BudgetMonthStatus;
};

export type MonthEndAllocationInput = {
  destinationType:
    | "next_month"
    | "savings"
    | "goal"
    | "unallocated";
  amount: number;
  goalId?: string;
};

type BudgetMonthRecord = {
  id: string;
  month_start: string;
  status: BudgetMonthStatus;
  closed_at: string | null;
  closing_balance: number | string | null;
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
  const [budgetMonthStatus, setBudgetMonthStatus] =
    useState<BudgetMonthStatus>("open");

  const [budgetMonths, setBudgetMonths] = useState<
    BudgetMonthSummary[]
  >([]);

  const [closedAt, setClosedAt] = useState<string | null>(null);

  const [closingBalance, setClosingBalance] =
    useState<number | null>(null);

  const [carryoverReceived, setCarryoverReceived] = useState(0);

  const [savingsBalance, setSavingsBalance] = useState(0);
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

      const {
        data: budgetMonthsData,
        error: budgetMonthsError,
      } = await supabase
        .from("budget_months")
        .select("month_start, status")
        .eq("user_id", user.id)
        .order("month_start", { ascending: true });

      if (budgetMonthsError) {
        console.error(
          "Unable to load budget month statuses:",
          budgetMonthsError
        );
      }

      const { start, end } = getMonthRange(selectedMonthStart);

      let budgetMonth: BudgetMonthRecord | null = null;

      const {
        data: existingMonthData,
        error: existingMonthError,
      } = await supabase
        .from("budget_months")
        .select(
          "id, month_start, status, closed_at, closing_balance"
        )
        .eq("user_id", user.id)
        .eq("month_start", selectedMonthStart)
        .maybeSingle();

      if (existingMonthError) {
        console.error(
          "Unable to search for budget month:",
          existingMonthError
        );
      }

      if (existingMonthData) {
        budgetMonth = existingMonthData as BudgetMonthRecord;
      } else {
        const {
          data: createdMonthData,
          error: createdMonthError,
        } = await supabase
          .from("budget_months")
          .insert({
            user_id: user.id,
            month_start: selectedMonthStart,
            status: "open",
          })
          .select(
            "id, month_start, status, closed_at, closing_balance"
          )
          .single();

        if (createdMonthError) {
          console.error(
            "Unable to create budget month:",
            createdMonthError
          );

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

        budgetMonth = createdMonthData as BudgetMonthRecord;

        setBudgetMonths((currentMonths) => {
          const monthAlreadyExists = currentMonths.some(
            (month) =>
              month.monthStart === createdMonthData.month_start
          );

          if (monthAlreadyExists) {
            return currentMonths;
          }

          return [
            ...currentMonths,
            {
              monthStart: createdMonthData.month_start,
              status: createdMonthData.status as BudgetMonthStatus,
            },
          ];
        });
      }

      if (!budgetMonth) {
        console.error("The selected budget month could not be loaded.");

        if (!isCancelled) {
          setBudgetMonthId(null);
          setIsBudgetLoading(false);
        }

        return;
      }

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

      if (
        budgetMonth.status === "open" &&
        activeIncomeTemplates.length > 0
      ) {
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

      const [carryoverResult, savingsResult] = await Promise.all([
        supabase
          .from("month_end_allocations")
          .select("amount")
          .eq("user_id", user.id)
          .eq("destination_type", "next_month")
          .eq("destination_budget_month_id", budgetMonth.id),

        supabase
          .from("month_end_allocations")
          .select("amount")
          .eq("user_id", user.id)
          .eq("destination_type", "savings"),
      ]);

      if (carryoverResult.error) {
        console.error(
          "Unable to load received carryover:",
          carryoverResult.error
        );
      }

      if (savingsResult.error) {
        console.error(
          "Unable to load savings balance:",
          savingsResult.error
        );
      }

      const loadedCarryover = (carryoverResult.data ?? []).reduce(
        (total, allocation) => total + Number(allocation.amount),
        0
      );

      const loadedSavingsBalance = (savingsResult.data ?? []).reduce(
        (total, allocation) => total + Number(allocation.amount),
        0
      );

      if (
        budgetMonth.status === "open" &&
        baseCategories.length > 0
      ) {
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

      if (
        budgetMonth.status === "open" &&
        baseBills.length > 0
      ) {
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
        setBudgetMonths(
          (budgetMonthsData ?? []).map((month) => ({
            monthStart: month.month_start,
            status: month.status as BudgetMonthStatus,
          }))
        );
        setBudgetMonthId(budgetMonth.id);

        setBudgetMonthStatus(budgetMonth.status);
        setClosedAt(budgetMonth.closed_at);

        setClosingBalance(
          budgetMonth.closing_balance === null
            ? null
            : Number(budgetMonth.closing_balance)
        );

        setCarryoverReceived(loadedCarryover);
        setSavingsBalance(loadedSavingsBalance);

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

  function requireOpenBudgetMonth() {
    if (budgetMonthStatus === "closed") {
      throw new Error(
        "This budget month is closed and can no longer be changed."
      );
    }
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

  function goToMonth(monthStart: string) {
    setSelectedMonthStart(monthStart);
  }

  async function addCategory(category: Category) {
    try {
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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
      requireOpenBudgetMonth();

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

  async function closeBudgetMonth(
    allocations: MonthEndAllocationInput[]
  ) {
    try {
      const userId = await getCurrentUserId();
      const sourceMonthId = requireBudgetMonthId();

      if (budgetMonthStatus === "closed") {
        throw new Error("This budget month is already closed.");
      }

      const income = incomeSources.reduce(
        (total, incomeSource) => total + incomeSource.amount,
        0
      );

      const spent = transactions.reduce(
        (total, transaction) =>
          transaction.amount < 0
            ? total + Math.abs(transaction.amount)
            : total,
        0
      );

      const remainingBalance =
        income + carryoverReceived - spent;

      if (remainingBalance < 0) {
        throw new Error(
          "This month cannot be closed with allocations because it has a negative balance."
        );
      }

      const cleanedAllocations = allocations
        .map((allocation) => ({
          ...allocation,
          amount: Number(allocation.amount),
        }))
        .filter((allocation) => allocation.amount > 0);

      const allocatedTotal = cleanedAllocations.reduce(
        (total, allocation) => total + allocation.amount,
        0
      );

      if (allocatedTotal > remainingBalance + 0.005) {
        throw new Error(
          "Your allocations cannot exceed the money remaining this month."
        );
      }

      const goalAllocations = cleanedAllocations.filter(
        (allocation) =>
          allocation.destinationType === "goal"
      );

      for (const allocation of goalAllocations) {
        if (!allocation.goalId) {
          throw new Error(
            "Each goal allocation must have a selected goal."
          );
        }

        const selectedGoal = goals.find(
          (goal) => goal.id === allocation.goalId
        );

        if (!selectedGoal) {
          throw new Error(
            "One of the selected savings goals could not be found."
          );
        }
      }

      const nextMonthStart = shiftMonth(
        selectedMonthStart,
        1
      );

      let destinationMonthId: string | null = null;

      const hasNextMonthAllocation = cleanedAllocations.some(
        (allocation) =>
          allocation.destinationType === "next_month"
      );

      if (hasNextMonthAllocation) {
        const {
          data: existingNextMonth,
          error: existingNextMonthError,
        } = await supabase
          .from("budget_months")
          .select("id")
          .eq("user_id", userId)
          .eq("month_start", nextMonthStart)
          .maybeSingle();

        if (existingNextMonthError) {
          throw existingNextMonthError;
        }

        if (existingNextMonth) {
          destinationMonthId = existingNextMonth.id;
        } else {
          const {
            data: createdNextMonth,
            error: createdNextMonthError,
          } = await supabase
            .from("budget_months")
            .insert({
              user_id: userId,
              month_start: nextMonthStart,
              status: "open",
            })
            .select("id")
            .single();

          if (createdNextMonthError) {
            throw createdNextMonthError;
          }

          destinationMonthId = createdNextMonth.id;
        }
      }

      if (cleanedAllocations.length > 0) {
        const allocationRows = cleanedAllocations.map(
          (allocation) => ({
            id: crypto.randomUUID(),
            user_id: userId,
            source_budget_month_id: sourceMonthId,
            destination_type: allocation.destinationType,
            destination_budget_month_id:
              allocation.destinationType === "next_month"
                ? destinationMonthId
                : null,
            goal_id:
              allocation.destinationType === "goal"
                ? allocation.goalId ?? null
                : null,
            amount: allocation.amount,
          })
        );

        const { error: allocationError } = await supabase
          .from("month_end_allocations")
          .insert(allocationRows);

        if (allocationError) {
          throw allocationError;
        }
      }

      const goalAmounts = new Map<string, number>();

      for (const allocation of goalAllocations) {
        const goalId = allocation.goalId as string;

        goalAmounts.set(
          goalId,
          (goalAmounts.get(goalId) ?? 0) + allocation.amount
        );
      }

      const updatedGoals: Goal[] = [];

      for (const [goalId, contributionAmount] of goalAmounts) {
        const selectedGoal = goals.find(
          (goal) => goal.id === goalId
        );

        if (!selectedGoal) continue;

        const newCurrentAmount =
          selectedGoal.currentAmount + contributionAmount;

        const { data, error } = await supabase
          .from("goals")
          .update({
            current_amount: newCurrentAmount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", goalId)
          .eq("user_id", userId)
          .select(
            "id, name, target_amount, current_amount, target_date"
          )
          .single();

        if (error) {
          throw error;
        }

        updatedGoals.push({
          id: data.id,
          name: data.name,
          targetAmount: Number(data.target_amount),
          currentAmount: Number(data.current_amount),
          targetDate: data.target_date,
        });
      }

      const closedTimestamp = new Date().toISOString();

      const { error: closeMonthError } = await supabase
        .from("budget_months")
        .update({
          status: "closed",
          closed_at: closedTimestamp,
          closing_balance: remainingBalance,
          updated_at: closedTimestamp,
        })
        .eq("id", sourceMonthId)
        .eq("user_id", userId);

      if (closeMonthError) {
        throw closeMonthError;
      }

      setBudgetMonthStatus("closed");
      setBudgetMonths((currentMonths) =>
        currentMonths.map((month) =>
          month.monthStart === selectedMonthStart
            ? { ...month, status: "closed" }
            : month
        )
      );
      setClosedAt(closedTimestamp);
      setClosingBalance(remainingBalance);

      if (updatedGoals.length > 0) {
        setGoals((currentGoals) =>
          currentGoals.map((goal) => {
            const updatedGoal = updatedGoals.find(
              (candidate) => candidate.id === goal.id
            );

            return updatedGoal ?? goal;
          })
        );
      }

      const savingsAdded = cleanedAllocations
        .filter(
          (allocation) =>
            allocation.destinationType === "savings"
        )
        .reduce(
          (total, allocation) => total + allocation.amount,
          0
        );

      if (savingsAdded > 0) {
        setSavingsBalance(
          (currentBalance) =>
            currentBalance + savingsAdded
        );
      }
    } catch (error) {
      console.error("Unable to close budget month:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to close the selected budget month."
      );

      throw error;
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
        budgetMonthStatus,
        budgetMonths,
        closedAt,
        closingBalance,
        carryoverReceived,
        savingsBalance,
        isBudgetLoading,
        goToPreviousMonth,
        goToNextMonth,
        goToCurrentMonth,
        goToMonth,

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
        closeBudgetMonth,
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