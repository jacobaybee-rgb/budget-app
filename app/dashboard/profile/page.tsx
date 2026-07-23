"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Mail,
  Palette,
  Save,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getProfile,
  updateProfile,
  type Profile,
} from "@/lib/database/profiles";
import NotificationSettings from "@/components/profile/NotificationSettings";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [fullName, setFullName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budgetCycle, setBudgetCycle] = useState("monthly");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login");
      router.refresh();
      return;
    }

    try {
      const loadedProfile = await getProfile(
        supabase,
        user.id
      );

      setProfile(loadedProfile);
      setFullName(loadedProfile.full_name);
      setCurrency(loadedProfile.currency);
      setBudgetCycle(loadedProfile.budget_cycle);
    } catch (error) {
      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load profile."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSaveProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile) return;

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setMessageType("error");
      setMessage("Display name is required.");
      return;
    }

    setMessage("");
    setIsSaving(true);

    try {
      const updatedProfile = await updateProfile(
        supabase,
        profile.id,
        {
          full_name: trimmedName,
          currency,
          budget_cycle: budgetCycle,
        }
      );

      setProfile(updatedProfile);
      setFullName(updatedProfile.full_name);

      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: updatedProfile,
        })
      );

      setMessageType("success");
      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    setMessage("");
    setIsSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      setIsSigningOut(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  const initials = getInitials(fullName);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-8">
        <p className="text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-8 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
          Account Center
        </p>

        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
          Profile & Settings
        </h1>

        <p className="mt-2 max-w-2xl text-zinc-400">
          Manage your account information and budgeting preferences.
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-blue-500/30 bg-zinc-950/80 shadow-xl">
        <div className="h-24 bg-gradient-to-r from-blue-950 via-zinc-950 to-purple-950" />

        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-zinc-950 bg-blue-500 text-3xl font-bold text-white shadow-lg">
              {initials}
            </div>

            <div className="pb-1">
              <h2 className="text-3xl font-bold">
                {fullName || "Budget User"}
              </h2>

              <p className="mt-1 text-zinc-400">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSaveProfile}>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                <UserRound size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Account Information
                </h2>

                <p className="text-sm text-zinc-400">
                  Information connected to your account.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="full-name"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Display Name
                </label>

                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  type="text"
                  maxLength={80}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    id="profile-email"
                    value={profile?.email ?? ""}
                    type="email"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-900/60 py-3 pl-11 pr-4 text-zinc-500"
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Email changes will be added later through account
                  security settings.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <ShieldCheck
                  size={20}
                  className="text-green-400"
                />

                <div>
                  <p className="font-semibold text-white">
                    Authenticated Account
                  </p>

                  <p className="text-sm text-zinc-400">
                    Your account is connected to Supabase Auth.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                <Settings size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Budget Preferences
                </h2>

                <p className="text-sm text-zinc-400">
                  Customize how your budget is displayed.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="currency"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Currency
                </label>

                <select
                  id="currency"
                  value={currency}
                  onChange={(event) =>
                    setCurrency(event.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                >
                  <option value="USD">
                    USD — United States Dollar
                  </option>

                  <option value="CAD">
                    CAD — Canadian Dollar
                  </option>

                  <option value="EUR">EUR — Euro</option>

                  <option value="GBP">
                    GBP — British Pound
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="budget-cycle"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Budget Cycle
                </label>

                <select
                  id="budget-cycle"
                  value={budgetCycle}
                  onChange={(event) =>
                    setBudgetCycle(event.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                >
                  <option value="weekly">Weekly</option>

                  <option value="biweekly">Biweekly</option>

                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-sm text-zinc-400">
                  These preferences are now stored in PostgreSQL and
                  belong only to your account.
                </p>
              </div>
            </div>
          </section>
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

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-400 px-6 py-3 font-bold text-black transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <NotificationSettings />

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-300">
            <Palette size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold">Appearance</h2>

            <p className="text-sm text-zinc-400">
              Your dashboard currently uses its dynamic time-based
              appearance.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SettingCard label="Theme" value="Dynamic" />
          <SettingCard label="Style" value="Command Center" />
          <SettingCard label="Background" value="Time Based" />
        </div>
      </section>

      <section className="rounded-2xl border border-red-500/25 bg-red-950/10 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Sign Out
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              End your current session and return to the welcome page.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} />

            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </section>
    </div>
  );
}

function SettingCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "BU";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}