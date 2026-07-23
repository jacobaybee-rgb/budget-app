import type { Bill } from "@/types/bill";
import type { Category } from "@/types/category";
import type { Goal } from "@/types/goal";
import type { IncomeSource } from "@/types/income";
import type {
  AppNotification,
  NotificationPreferences,
  NotificationPriority,
} from "@/types/notification";
import type { Transaction } from "@/types/transaction";

type BudgetMonthStatus = "open" | "closed";

type NotificationInput = {
  bills: Bill[];
  incomeSources: IncomeSource[];
  categories: Category[];
  transactions: Transaction[];
  goals: Goal[];

  selectedMonthStart: string;
  budgetMonthStatus: BudgetMonthStatus;

  preferences: NotificationPreferences;
};

type DatedNotification = AppNotification & {
  sortDate?: Date;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getNotifications({
  bills,
  incomeSources,
  categories,
  transactions,
  goals,
  selectedMonthStart,
  budgetMonthStatus,
  preferences,
}: NotificationInput): AppNotification[] {
  const today = startOfDay(new Date());

  const notifications: DatedNotification[] = [
    ...getBillNotifications({
      bills,
      selectedMonthStart,
      today,
      preferences,
    }),

    ...getIncomeNotifications({
      incomeSources,
      today,
      preferences,
    }),

    ...getCategoryNotifications({
      categories,
      transactions,
      preferences,
    }),

    ...getGoalNotifications({
      goals,
      today,
      preferences,
    }),

    ...getMonthNotifications({
      selectedMonthStart,
      budgetMonthStatus,
      today,
      preferences,
    }),
  ];

  return notifications
    .sort(compareNotifications)
    .map(({ sortDate: _sortDate, ...notification }) => notification);
}

function getBillNotifications({
  bills,
  selectedMonthStart,
  today,
  preferences,
}: {
  bills: Bill[];
  selectedMonthStart: string;
  today: Date;
  preferences: NotificationPreferences;
}): DatedNotification[] {
  if (!preferences.billsEnabled) {
    return [];
  }

  const notifications: DatedNotification[] = [];

  for (const bill of bills) {
    if (bill.isPaid) {
      continue;
    }

    const dueDate = getDateInsideMonth(
      selectedMonthStart,
      bill.dueDay
    );

    const daysUntilDue = getDaysBetween(today, dueDate);

    if (
      daysUntilDue < 0 &&
      preferences.overdueBillsEnabled
    ) {
      const overdueDays = Math.abs(daysUntilDue);

      notifications.push({
        id: `bill-overdue-${bill.id}-${formatDateKey(dueDate)}`,
        type: "bill",
        title: `${bill.name} has not been paid`,
        message: `${formatCurrency(
          bill.amount
        )} was due ${formatRelativePastDays(
          overdueDays
        )} and is now overdue.`,
        href: "/dashboard/bills",
        priority: "urgent",
        eventDate: formatDateKey(dueDate),
        sortDate: dueDate,
      });

      continue;
    }

    if (
      !preferences.billReminderDays.includes(daysUntilDue)
    ) {
      continue;
    }

    notifications.push({
      id: `bill-due-${bill.id}-${formatDateKey(dueDate)}`,
      type: "bill",
      title: `${bill.name} has not been paid`,
      message: `${formatCurrency(
        bill.amount
      )} is ${formatFutureTiming(daysUntilDue)}.`,
      href: "/dashboard/bills",
      priority: "urgent",
      eventDate: formatDateKey(dueDate),
      sortDate: dueDate,
    });
  }

  return notifications;
}

function getIncomeNotifications({
  incomeSources,
  today,
  preferences,
}: {
  incomeSources: IncomeSource[];
  today: Date;
  preferences: NotificationPreferences;
}): DatedNotification[] {
  if (!preferences.incomeEnabled) {
    return [];
  }

  const notifications: DatedNotification[] = [];

  for (const income of incomeSources) {
    const incomeDate = parseDateKey(income.date);

    const daysUntilIncome = getDaysBetween(
      today,
      incomeDate
    );

    if (
      daysUntilIncome < 0 ||
      !preferences.incomeReminderDays.includes(
        daysUntilIncome
      )
    ) {
      continue;
    }

    notifications.push({
      id: `income-${income.id}-${income.date}`,
      type: "income",
      title: getIncomeReminderTitle(
        income.source,
        daysUntilIncome
      ),
      message: `${formatCurrency(
        income.amount
      )} is expected ${formatIncomeTiming(
        daysUntilIncome
      )}.`,
      href: "/dashboard/income",
      priority: "success",
      eventDate: income.date,
      sortDate: incomeDate,
    });
  }

  return notifications;
}

function getCategoryNotifications({
  categories,
  transactions,
  preferences,
}: {
  categories: Category[];
  transactions: Transaction[];
  preferences: NotificationPreferences;
}): DatedNotification[] {
  if (
    !preferences.categoriesEnabled ||
    !preferences.overBudgetEnabled
  ) {
    return [];
  }

  const notifications: DatedNotification[] = [];

  for (const category of categories) {
    if (category.budget <= 0) {
      continue;
    }

    const spent = transactions.reduce(
      (total, transaction) => {
        const isMatchingCategory =
          transaction.category === category.name;

        const isExpense = transaction.amount < 0;

        if (!isMatchingCategory || !isExpense) {
          return total;
        }

        return total + Math.abs(transaction.amount);
      },
      0
    );

    // No notification when under budget or exactly on budget.
    if (spent <= category.budget) {
      continue;
    }

    const overBy = spent - category.budget;

    notifications.push({
      id: `category-over-${category.id}`,
      type: "category",
      title: `${category.name} is over budget`,
      message: `You have spent ${formatCurrency(
        spent
      )}, which is ${formatCurrency(
        overBy
      )} over the ${formatCurrency(
        category.budget
      )} budget.`,
      href: "/dashboard/categories",
      priority: "warning",
    });
  }

  return notifications;
}

function getGoalNotifications({
  goals,
  today,
  preferences,
}: {
  goals: Goal[];
  today: Date;
  preferences: NotificationPreferences;
}): DatedNotification[] {
  if (!preferences.goalsEnabled) {
    return [];
  }

  const notifications: DatedNotification[] = [];

  for (const goal of goals) {
    if (goal.targetAmount <= 0) {
      continue;
    }

    const progressPercent = Math.round(
      (goal.currentAmount / goal.targetAmount) * 100
    );

    const targetDate = parseDateKey(goal.targetDate);

    if (
      progressPercent >= 100 &&
      preferences.goalCompletedEnabled
    ) {
      notifications.push({
        id: `goal-complete-${goal.id}`,
        type: "goal",
        title: `${goal.name} has been reached!`,
        message: `You successfully reached your ${formatCurrency(
          goal.targetAmount
        )} goal.`,
        href: "/dashboard/goals",
        priority: "warning",
        eventDate: goal.targetDate,
        sortDate: targetDate,
      });

      continue;
    }

    if (
      progressPercent >= preferences.goalWarningPercent
    ) {
      const remaining = Math.max(
        goal.targetAmount - goal.currentAmount,
        0
      );

      notifications.push({
        id: `goal-progress-${goal.id}-${preferences.goalWarningPercent}`,
        type: "goal",
        title: `${goal.name} is ${progressPercent}% complete`,
        message: `${formatCurrency(
          remaining
        )} remains to reach this goal.`,
        href: "/dashboard/goals",
        priority: "warning",
        eventDate: goal.targetDate,
        sortDate: targetDate,
      });
    }

    const daysUntilTarget = getDaysBetween(
      today,
      targetDate
    );

    if (
      daysUntilTarget >= 0 &&
      preferences.goalDueReminderDays.includes(
        daysUntilTarget
      )
    ) {
      notifications.push({
        id: `goal-due-${goal.id}-${goal.targetDate}`,
        type: "goal",
        title: getGoalDueTitle(
          goal.name,
          daysUntilTarget
        ),
        message: `${formatCurrency(
          Math.max(
            goal.targetAmount - goal.currentAmount,
            0
          )
        )} remains before the target date.`,
        href: "/dashboard/goals",
        priority: "warning",
        eventDate: goal.targetDate,
        sortDate: targetDate,
      });
    }
  }

  return notifications;
}

function getMonthNotifications({
  selectedMonthStart,
  budgetMonthStatus,
  today,
  preferences,
}: {
  selectedMonthStart: string;
  budgetMonthStatus: BudgetMonthStatus;
  today: Date;
  preferences: NotificationPreferences;
}): DatedNotification[] {
  if (
    !preferences.monthCloseEnabled ||
    budgetMonthStatus === "closed"
  ) {
    return [];
  }

  const monthStart = parseDateKey(selectedMonthStart);

  const monthEnd = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0
  );

  const selectedMonthLabel =
    monthStart.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const isPastMonth =
    monthEnd.getTime() < today.getTime();

  if (isPastMonth) {
    return [
      {
        id: `month-overdue-${selectedMonthStart}`,
        type: "month",
        title: `${selectedMonthLabel} is still open`,
        message:
          "Review the month and close it when you are ready to allocate the remaining balance.",
        href: "/dashboard",
        priority: "urgent",
        eventDate: formatDateKey(monthEnd),
        sortDate: monthEnd,
      },
    ];
  }

  const daysUntilMonthEnd = getDaysBetween(
    today,
    monthEnd
  );

  if (daysUntilMonthEnd !== 0) {
    return [];
  }

  return [
    {
      id: `month-ready-${selectedMonthStart}`,
      type: "month",
      title: `${selectedMonthLabel} is ready to close`,
      message:
        "Review your activity and allocate any remaining money before closing the month.",
      href: "/dashboard",
      priority: "warning",
      eventDate: formatDateKey(monthEnd),
      sortDate: monthEnd,
    },
  ];
}

function compareNotifications(
  first: DatedNotification,
  second: DatedNotification
) {
  const priorityDifference =
    getPriorityWeight(second.priority) -
    getPriorityWeight(first.priority);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  if (first.sortDate && second.sortDate) {
    return (
      first.sortDate.getTime() -
      second.sortDate.getTime()
    );
  }

  if (first.sortDate) {
    return -1;
  }

  if (second.sortDate) {
    return 1;
  }

  return first.title.localeCompare(second.title);
}

function getPriorityWeight(
  priority: NotificationPriority
) {
  switch (priority) {
    case "urgent":
      return 4;

    case "warning":
      return 3;

    case "success":
      return 2;

    case "info":
      return 1;
  }
}

function getIncomeReminderTitle(
  incomeSource: string,
  daysUntilIncome: number
) {
  if (daysUntilIncome === 0) {
    return `${incomeSource} arrives today`;
  }

  if (daysUntilIncome === 1) {
    return `${incomeSource} arrives tomorrow`;
  }

  return `${incomeSource} arrives in ${daysUntilIncome} days`;
}

function getGoalDueTitle(
  goalName: string,
  daysUntilTarget: number
) {
  if (daysUntilTarget === 0) {
    return `${goalName} is due today`;
  }

  if (daysUntilTarget === 1) {
    return `${goalName} is due tomorrow`;
  }

  return `${goalName} is due in ${daysUntilTarget} days`;
}

function formatFutureTiming(daysUntilEvent: number) {
  if (daysUntilEvent === 0) {
    return "due today";
  }

  if (daysUntilEvent === 1) {
    return "due tomorrow";
  }

  return `due in ${daysUntilEvent} days`;
}

function formatIncomeTiming(daysUntilIncome: number) {
  if (daysUntilIncome === 0) {
    return "today";
  }

  if (daysUntilIncome === 1) {
    return "tomorrow";
  }

  return `in ${daysUntilIncome} days`;
}

function formatRelativePastDays(daysAgo: number) {
  if (daysAgo === 1) {
    return "yesterday";
  }

  return `${daysAgo} days ago`;
}

function getDateInsideMonth(
  monthStart: string,
  preferredDay: number
) {
  const monthDate = parseDateKey(monthStart);

  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();

  const finalDay = new Date(
    year,
    monthIndex + 1,
    0
  ).getDate();

  const safeDay = Math.min(
    Math.max(preferredDay, 1),
    finalDay
  );

  return new Date(year, monthIndex, safeDay);
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function getDaysBetween(
  startingDate: Date,
  endingDate: Date
) {
  const normalizedStart = startOfDay(startingDate);
  const normalizedEnd = startOfDay(endingDate);

  return Math.round(
    (normalizedEnd.getTime() -
      normalizedStart.getTime()) /
      ONE_DAY_IN_MS
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}