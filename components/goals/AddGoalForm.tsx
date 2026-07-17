"use client";

import { useEffect, useState } from "react";
import type { Goal } from "@/types/goal";

type AddGoalFormProps = {
  editingGoal: Goal | null;
  onAddGoal: (goal: Goal) => Promise<void>;
  onUpdateGoal: (goal: Goal) => Promise<void>;
  onCancelEdit: () => void;
};

export default function AddGoalForm({
  editingGoal,
  onAddGoal,
  onUpdateGoal,
  onCancelEdit,
}: AddGoalFormProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setTargetAmount(editingGoal.targetAmount.toString());
      setCurrentAmount(editingGoal.currentAmount.toString());
      setTargetDate(editingGoal.targetDate);
      return;
    }

    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
  }, [editingGoal]);

  function resetForm() {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const targetNumber = Number(targetAmount);
    const currentNumber = Number(currentAmount);

    if (!trimmedName) {
      alert("Goal name is required.");
      return;
    }

    if (!Number.isFinite(targetNumber) || targetNumber <= 0) {
      alert("Target amount must be greater than 0.");
      return;
    }

    if (!Number.isFinite(currentNumber) || currentNumber < 0) {
      alert("Current amount cannot be negative.");
      return;
    }

    if (!targetDate) {
      alert("Please select a target date.");
      return;
    }

    const goal: Goal = {
      id: editingGoal?.id ?? crypto.randomUUID(),
      name: trimmedName,
      targetAmount: targetNumber,
      currentAmount: currentNumber,
      targetDate,
    };

    try {
      setIsSubmitting(true);

      if (editingGoal) {
        await onUpdateGoal(goal);
      } else {
        await onAddGoal(goal);
      }

      resetForm();
    } catch {
      // BudgetContext already displays the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-fit space-y-4 rounded-2xl border border-yellow-400/80 bg-zinc-950/80 p-6"
    >
      <div>
        <p className="text-sm uppercase tracking-widest text-yellow-400">
          {editingGoal ? "Edit Goal" : "Add Goal"}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {editingGoal
            ? "Update the details for this goal."
            : "What are you saving for?"}
        </p>
      </div>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Goal name"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
      />

      <input
        value={targetAmount}
        onChange={(event) => setTargetAmount(event.target.value)}
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Target amount"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
      />

      <input
        value={currentAmount}
        onChange={(event) => setCurrentAmount(event.target.value)}
        type="number"
        min="0"
        step="0.01"
        placeholder="Current amount saved"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
      />

      <div>
        <label
          htmlFor="goal-target-date"
          className="mb-2 block text-sm text-zinc-400"
        >
          Target date
        </label>

        <input
          id="goal-target-date"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
          type="date"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-400"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 font-bold text-yellow-400 transition hover:bg-yellow-400/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? editingGoal
            ? "Saving..."
            : "Creating..."
          : editingGoal
            ? "Save Changes"
            : "Create Goal"}
      </button>

      {editingGoal && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-zinc-700 py-3 font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      )}
    </form>
  );
}