"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Banknote,
  BellRing,
  CalendarClock,
  ChevronDown,
  PiggyBank,
  ReceiptText,
  Save,
  TriangleAlert,
} from "lucide-react";
import { useBudget } from "@/context/BudgetContext";
import type { NotificationPreferences } from "@/types/notification";
import NotificationCard from "./notifications/NotificationCard";
import NumberSetting from "./notifications/NumberSetting";
import ReminderOptions from "./notifications/ReminderOptions";
import SettingSummary from "./notifications/SettingSummary";
import ToggleRow from "./notifications/ToggleRow";

const BILL_REMINDER_OPTIONS = [0, 1, 3, 7];
const INCOME_REMINDER_OPTIONS = [0, 1, 3, 7];
const GOAL_REMINDER_OPTIONS = [0, 1, 3, 7, 14, 30];

export default function NotificationSettings() {
  const {
    notificationPreferences,
    saveNotificationPreferences,
  } = useBudget();

  const [draft, setDraft] =
    useState<NotificationPreferences>(
      notificationPreferences
    );

  const [isExpanded, setIsExpanded] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  useEffect(() => {
    setDraft(notificationPreferences);
  }, [notificationPreferences]);

  useEffect(() => {
    if (window.location.hash !== "#notifications") {
      return;
    }

    setIsExpanded(true);

    window.setTimeout(() => {
      document
        .getElementById("notifications")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }, []);

  const summary = useMemo(
    () => ({
      bills: formatDays(draft.billReminderDays),
      income: formatDays(draft.incomeReminderDays),
      categories: draft.overBudgetEnabled
        ? "Over budget"
        : "Warnings off",
      goals: `${draft.goalWarningPercent}% progress`,
      monthClose: "End of month",
    }),
    [draft]
  );

  function updatePreference<
    Key extends keyof NotificationPreferences
  >(
    key: Key,
    value: NotificationPreferences[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  }

  function toggleReminderDay(
    key:
      | "billReminderDays"
      | "incomeReminderDays"
      | "goalDueReminderDays",
    day: number
  ) {
    setDraft((current) => {
      const currentDays = current[key];

      const nextDays = currentDays.includes(day)
        ? currentDays.filter(
            (currentDay) => currentDay !== day
          )
        : [...currentDays, day].sort(
            (first, second) => first - second
          );

      return {
        ...current,
        [key]: nextDays,
      };
    });

    setMessage("");
  }

  async function handleSave() {
    setMessage("");
    setIsSaving(true);

    try {
      await saveNotificationPreferences(draft);

      setMessageType("success");
      setMessage(
        "Notification preferences saved successfully."
      );
    } catch (error) {
      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save notification preferences."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      id="notifications"
      className="scroll-mt-8 overflow-hidden rounded-2xl border border-blue-500/25 bg-zinc-950/80"
    >
      <button
        type="button"
        onClick={() =>
          setIsExpanded((current) => !current)
        }
        aria-expanded={isExpanded}
        aria-controls="notification-settings-content"
        className="flex w-full items-start justify-between gap-4 p-6 text-left transition hover:bg-zinc-900/60 sm:p-8"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-300">
            <BellRing size={23} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white">
              Notification Settings
            </h2>

            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Customize reminders, alerts, and budget
              warnings.
            </p>

            {!isExpanded && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                <SettingSummary
                  label="Bills"
                  value={summary.bills}
                  enabled={draft.billsEnabled}
                />

                <SettingSummary
                  label="Income"
                  value={summary.income}
                  enabled={draft.incomeEnabled}
                />

                <SettingSummary
                  label="Categories"
                  value={summary.categories}
                  enabled={draft.categoriesEnabled}
                />

                <SettingSummary
                  label="Goals"
                  value={summary.goals}
                  enabled={draft.goalsEnabled}
                />

                <SettingSummary
                  label="Month Close"
                  value={summary.monthClose}
                  enabled={draft.monthCloseEnabled}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-2">
          <span className="hidden text-sm font-semibold text-zinc-400 sm:inline">
            {isExpanded ? "Collapse" : "Customize"}
          </span>

          <ChevronDown
            size={21}
            className={`text-zinc-400 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <div
        id="notification-settings-content"
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-800 p-6 sm:p-8">
            <div className="grid gap-5 lg:grid-cols-2">
              <NotificationCard
                icon={ReceiptText}
                iconClassName="bg-red-500/10 text-red-300"
                title="Bill Reminders"
                description="Get reminders for bills that have not been marked as paid."
                enabled={draft.billsEnabled}
                onEnabledChange={(enabled) =>
                  updatePreference(
                    "billsEnabled",
                    enabled
                  )
                }
              >
                <ReminderOptions
                  label="Remind me"
                  options={BILL_REMINDER_OPTIONS}
                  selectedDays={
                    draft.billReminderDays
                  }
                  disabled={!draft.billsEnabled}
                  onToggle={(day) =>
                    toggleReminderDay(
                      "billReminderDays",
                      day
                    )
                  }
                />

                <ToggleRow
                  label="Overdue bill alerts"
                  description="Continue showing an urgent alert after the due date."
                  checked={
                    draft.overdueBillsEnabled
                  }
                  disabled={!draft.billsEnabled}
                  onChange={(checked) =>
                    updatePreference(
                      "overdueBillsEnabled",
                      checked
                    )
                  }
                />
              </NotificationCard>

              <NotificationCard
                icon={Banknote}
                iconClassName="bg-emerald-500/10 text-emerald-300"
                title="Incoming Income"
                description="Show upcoming notifications for expected income."
                enabled={draft.incomeEnabled}
                onEnabledChange={(enabled) =>
                  updatePreference(
                    "incomeEnabled",
                    enabled
                  )
                }
              >
                <ReminderOptions
                  label="Notify me"
                  options={INCOME_REMINDER_OPTIONS}
                  selectedDays={
                    draft.incomeReminderDays
                  }
                  disabled={!draft.incomeEnabled}
                  onToggle={(day) =>
                    toggleReminderDay(
                      "incomeReminderDays",
                      day
                    )
                  }
                />
              </NotificationCard>

              <NotificationCard
                icon={TriangleAlert}
                iconClassName="bg-amber-500/10 text-amber-300"
                title="Category Budgets"
                description="Show a warning when a category goes over budget."
                enabled={draft.categoriesEnabled}
                onEnabledChange={(enabled) =>
                  updatePreference(
                    "categoriesEnabled",
                    enabled
                  )
                }
              >
                <ToggleRow
                  label="Over-budget warnings"
                  description="Notify me after spending exceeds the category budget."
                  checked={draft.overBudgetEnabled}
                  disabled={
                    !draft.categoriesEnabled
                  }
                  onChange={(checked) =>
                    updatePreference(
                      "overBudgetEnabled",
                      checked
                    )
                  }
                />
              </NotificationCard>

              <NotificationCard
                icon={PiggyBank}
                iconClassName="bg-yellow-500/10 text-yellow-300"
                title="Savings Goals"
                description="Get progress, deadline, and completed-goal notifications."
                enabled={draft.goalsEnabled}
                onEnabledChange={(enabled) =>
                  updatePreference(
                    "goalsEnabled",
                    enabled
                  )
                }
              >
                <NumberSetting
                  id="goal-warning-percent"
                  label="Progress notification"
                  description="Notify me when a goal reaches this percentage."
                  value={
                    draft.goalWarningPercent
                  }
                  disabled={!draft.goalsEnabled}
                  min={1}
                  max={99}
                  suffix="%"
                  onChange={(value) =>
                    updatePreference(
                      "goalWarningPercent",
                      value
                    )
                  }
                />

                <ReminderOptions
                  label="Deadline reminders"
                  options={GOAL_REMINDER_OPTIONS}
                  selectedDays={
                    draft.goalDueReminderDays
                  }
                  disabled={!draft.goalsEnabled}
                  onToggle={(day) =>
                    toggleReminderDay(
                      "goalDueReminderDays",
                      day
                    )
                  }
                />

                <ToggleRow
                  label="Completed goal notifications"
                  description="Notify me when a savings goal has been reached."
                  checked={
                    draft.goalCompletedEnabled
                  }
                  disabled={!draft.goalsEnabled}
                  onChange={(checked) =>
                    updatePreference(
                      "goalCompletedEnabled",
                      checked
                    )
                  }
                />
              </NotificationCard>
            </div>

            <div className="mt-5">
              <NotificationCard
                icon={CalendarClock}
                iconClassName="bg-purple-500/10 text-purple-300"
                title="Month Closing"
                description="Receive a reminder when a budget month is ready to close."
                enabled={draft.monthCloseEnabled}
                onEnabledChange={(enabled) =>
                  updatePreference(
                    "monthCloseEnabled",
                    enabled
                  )
                }
              />
            </div>

            {message && (
              <p
                className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "border-green-500/30 bg-green-950/30 text-green-300"
                    : "border-red-500/30 bg-red-950/30 text-red-300"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-6 flex justify-end border-t border-zinc-800 pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-400 px-6 py-3 font-bold text-black transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Save size={17} />

                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDays(days: number[]) {
  if (days.length === 0) {
    return "No reminders";
  }

  return days
    .slice()
    .sort((first, second) => second - first)
    .map((day) => {
      if (day === 0) {
        return "Due date";
      }

      return `${day}d`;
    })
    .join(" • ");
}