"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import GoalsHeader from "@/components/goals/GoalsHeader";
import GoalsStats from "@/components/goals/GoalsStats";
import AddGoalForm from "@/components/goals/AddGoalForm";
import GoalsList from "@/components/goals/GoalsListComponent"
import type { Goal } from "@/types/goal";

export default function GoalsPage() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useBudget();

  const [editingGoal, setEditingGoal] =
    useState<Goal | null>(null);

  function handleEditGoal(goal: Goal) {
    setEditingGoal(goal);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleUpdateGoal(goal: Goal) {
    updateGoal(goal);
    setEditingGoal(null);
  }

  function handleDeleteGoal(id: string) {
    deleteGoal(id);

    if (editingGoal?.id === id) {
      setEditingGoal(null);
    }
  }

  return (
    <div className="space-y-8 px-8 py-8">
      <GoalsHeader />

      <GoalsStats goals={goals} />

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        <AddGoalForm
          editingGoal={editingGoal}
          onAddGoal={addGoal}
          onUpdateGoal={handleUpdateGoal}
          onCancelEdit={() => setEditingGoal(null)}
        />

        <GoalsList
          goals={goals}
          onEditGoal={handleEditGoal}
          onDeleteGoal={handleDeleteGoal}
        />
      </div>
    </div>
  );
}