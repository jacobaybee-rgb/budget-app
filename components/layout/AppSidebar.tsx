"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import {
  getProfile,
  type Profile,
} from "@/lib/database/profiles";
import { createClient } from "@/lib/supabase/client";

export default function AppSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] =
    useState(false);

  const [isSigningOut, setIsSigningOut] = useState(false);

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const loadedProfile = await getProfile(
        supabase,
        user.id
      );

      setProfile(loadedProfile);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "Unable to load sidebar profile."
      );

      setProfile(null);
    }
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    function handleProfileUpdated(event: Event) {
      const customEvent =
        event as CustomEvent<Profile>;

      if (!customEvent.detail) return;

      setProfile(customEvent.detail);
    }

    window.addEventListener(
      "profile-updated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "profile-updated",
        handleProfileUpdated
      );
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Unable to sign out:", error.message);
      setIsSigningOut(false);
      return;
    }

    setIsProfileMenuOpen(false);

    router.replace("/");
    router.refresh();
  }

  function handleProfileNavigation() {
    setIsProfileMenuOpen(false);
    onNavigate?.();
  }

  const displayName = profile?.full_name || "Budget User";
  const email = profile?.email || "Signed-in account";
  const initials = getInitials(displayName);

  return (
    <aside className="flex h-full min-h-screen w-60 flex-col border-r border-blue-400 bg-zinc-950 p-4">
      <div className="flex flex-col items-center border-b border-blue-400 pb-5">
        <Link href="/dashboard" onClick={onNavigate}>
          <Image
            src="/logos/bell-logo-v2.png"
            alt="Bell's Budgeting logo"
            width={140}
            height={140}
            priority
            className="drop-shadow-[0_0_15px_rgba(250,204,21,0.35)] transition duration-300 hover:scale-105"
          />
        </Link>

        <h1 className="text-center text-3xl font-bold leading-tight">
          Bell&apos;s
          <br />
          Budgeting
        </h1>
      </div>

      <nav className="mt-5 flex-1 space-y-2">
        <SidebarLink
          href="/dashboard"
          color="text-sky-300"
          onNavigate={onNavigate}
        >
          Dashboard
        </SidebarLink>

        <SidebarLink
          href="/dashboard/income"
          color="text-green-300"
          onNavigate={onNavigate}
        >
          Income
        </SidebarLink>

        <SidebarLink
          href="/dashboard/categories"
          color="text-purple-300"
          onNavigate={onNavigate}
        >
          Categories
        </SidebarLink>

        <SidebarLink
          href="/dashboard/transactions"
          color="text-orange-300"
          onNavigate={onNavigate}
        >
          Transactions
        </SidebarLink>

        <SidebarLink
          href="/dashboard/bills"
          color="text-red-400"
          onNavigate={onNavigate}
        >
          Bills
        </SidebarLink>

        <SidebarLink
          href="/dashboard/goals"
          color="text-yellow-400"
          onNavigate={onNavigate}
        >
          Goals
        </SidebarLink>
      </nav>

      <div ref={profileMenuRef} className="relative mt-6">
        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-3 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">
            <div className="border-b border-zinc-800 px-4 py-3">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="mt-1 truncate text-xs text-zinc-400">
                {email}
              </p>
            </div>

            <div className="p-2">
              <Link
                href="/dashboard/profile"
                onClick={handleProfileNavigation}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Settings size={18} />

                Profile & Settings
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-950/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={18} />

                {isSigningOut
                  ? "Signing Out..."
                  : "Sign Out"}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() =>
            setIsProfileMenuOpen(
              (currentValue) => !currentValue
            )
          }
          aria-expanded={isProfileMenuOpen}
          aria-label="Open account menu"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-left transition hover:border-blue-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">
                {displayName}
              </p>

              <p className="truncate text-sm text-zinc-400">
                Account Menu
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  color,
  children,
  onNavigate,
}: {
  href: string;
  color: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block rounded-xl px-4 py-3 transition hover:bg-zinc-900 hover:text-white ${color}`}
    >
      {children}
    </Link>
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