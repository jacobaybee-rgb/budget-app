export type NotificationType =
  | "bill"
  | "income"
  | "category"
  | "goal"
  | "month";

export type NotificationPriority =
  | "info"
  | "warning"
  | "urgent"
  | "success";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  priority: NotificationPriority;
  eventDate?: string;
};

export type NotificationPreferences = {
  id?: string;
  userId?: string;

  billsEnabled: boolean;
  billReminderDays: number[];
  overdueBillsEnabled: boolean;

  incomeEnabled: boolean;
  incomeReminderDays: number[];

  categoriesEnabled: boolean;
  categoryWarningPercent: number;
  overBudgetEnabled: boolean;

  goalsEnabled: boolean;
  goalWarningPercent: number;
  goalDueReminderDays: number[];
  goalCompletedEnabled: boolean;

  monthCloseEnabled: boolean;
};

export const defaultNotificationPreferences: NotificationPreferences =
  {
    billsEnabled: true,
    billReminderDays: [0, 1, 7],
    overdueBillsEnabled: true,

    incomeEnabled: true,
    incomeReminderDays: [0, 1],

    categoriesEnabled: true,
    categoryWarningPercent: 90,
    overBudgetEnabled: true,

    goalsEnabled: true,
    goalWarningPercent: 90,
    goalDueReminderDays: [0, 7],
    goalCompletedEnabled: true,

    monthCloseEnabled: true,
  };