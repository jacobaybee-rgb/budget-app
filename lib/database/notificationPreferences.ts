import type { SupabaseClient } from "@supabase/supabase-js";

import {
  defaultNotificationPreferences,
  type NotificationPreferences,
} from "@/types/notification";

type NotificationPreferencesRecord = {
  id: string;
  user_id: string;

  bills_enabled: boolean;
  bill_reminder_days: number[];
  overdue_bills_enabled: boolean;

  income_enabled: boolean;
  income_reminder_days: number[];

  categories_enabled: boolean;
  category_warning_percent: number;
  over_budget_enabled: boolean;

  goals_enabled: boolean;
  goal_warning_percent: number;
  goal_due_reminder_days: number[];
  goal_completed_enabled: boolean;

  month_close_enabled: boolean;
};

const notificationPreferenceFields = `
  id,
  user_id,
  bills_enabled,
  bill_reminder_days,
  overdue_bills_enabled,
  income_enabled,
  income_reminder_days,
  categories_enabled,
  category_warning_percent,
  over_budget_enabled,
  goals_enabled,
  goal_warning_percent,
  goal_due_reminder_days,
  goal_completed_enabled,
  month_close_enabled
`;

function mapRecordToPreferences(
  record: NotificationPreferencesRecord
): NotificationPreferences {
  return {
    id: record.id,
    userId: record.user_id,

    billsEnabled: record.bills_enabled,
    billReminderDays: record.bill_reminder_days,
    overdueBillsEnabled: record.overdue_bills_enabled,

    incomeEnabled: record.income_enabled,
    incomeReminderDays: record.income_reminder_days,

    categoriesEnabled: record.categories_enabled,
    categoryWarningPercent:
      record.category_warning_percent,
    overBudgetEnabled: record.over_budget_enabled,

    goalsEnabled: record.goals_enabled,
    goalWarningPercent: record.goal_warning_percent,
    goalDueReminderDays: record.goal_due_reminder_days,
    goalCompletedEnabled: record.goal_completed_enabled,

    monthCloseEnabled: record.month_close_enabled,
  };
}

function mapPreferencesToRecord(
  userId: string,
  preferences: NotificationPreferences
) {
  return {
    user_id: userId,

    bills_enabled: preferences.billsEnabled,
    bill_reminder_days: preferences.billReminderDays,
    overdue_bills_enabled:
      preferences.overdueBillsEnabled,

    income_enabled: preferences.incomeEnabled,
    income_reminder_days:
      preferences.incomeReminderDays,

    categories_enabled: preferences.categoriesEnabled,
    category_warning_percent:
      preferences.categoryWarningPercent,
    over_budget_enabled:
      preferences.overBudgetEnabled,

    goals_enabled: preferences.goalsEnabled,
    goal_warning_percent:
      preferences.goalWarningPercent,
    goal_due_reminder_days:
      preferences.goalDueReminderDays,
    goal_completed_enabled:
      preferences.goalCompletedEnabled,

    month_close_enabled:
      preferences.monthCloseEnabled,
  };
}

export async function getNotificationPreferences(
  supabase: SupabaseClient,
  userId: string
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select(notificationPreferenceFields)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load notification preferences: ${error.message}`
    );
  }

  if (data) {
    return mapRecordToPreferences(
      data as NotificationPreferencesRecord
    );
  }

  const { data: createdPreferences, error: createError } =
    await supabase
      .from("notification_preferences")
      .insert(
        mapPreferencesToRecord(
          userId,
          defaultNotificationPreferences
        )
      )
      .select(notificationPreferenceFields)
      .single();

  if (createError) {
    throw new Error(
      `Unable to create notification preferences: ${createError.message}`
    );
  }

  return mapRecordToPreferences(
    createdPreferences as NotificationPreferencesRecord
  );
}

export async function updateNotificationPreferences(
  supabase: SupabaseClient,
  userId: string,
  preferences: NotificationPreferences
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert(
      mapPreferencesToRecord(userId, preferences),
      {
        onConflict: "user_id",
      }
    )
    .select(notificationPreferenceFields)
    .single();

  if (error) {
    throw new Error(
      `Unable to save notification preferences: ${error.message}`
    );
  }

  return mapRecordToPreferences(
    data as NotificationPreferencesRecord
  );
}