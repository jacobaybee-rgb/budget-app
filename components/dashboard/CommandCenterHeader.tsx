"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getTimeTheme } from "@/lib/timeTheme";
import {
  getProfile,
  type Profile,
} from "@/lib/database/profiles";

export default function CommandCenterHeader() {
  const supabase = useMemo(() => createClient(), []);

  const [firstName, setFirstName] = useState("there");

  const { greeting } = getTimeTheme();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    try {
      const profile = await getProfile(
        supabase,
        user.id
      );

      setFirstName(getFirstName(profile.full_name));
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard profile."
      );
    }
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    function handleProfileUpdated(
      event: Event
    ) {
      const customEvent = 
        event as CustomEvent<Profile>;

      if (!customEvent.detail?.full_name) {
        return;
      }

      setFirstName(
        getFirstName(customEvent.detail.full_name)
      );
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

  return (
    <div className="relative z-20 max-w-4xl">
      <p className="text-lg font-bold uppercase tracking-widest text-white drop-shadow">
        Dashboard
      </p>

      <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">
        {greeting},
        <span className="block 2xl:inline">
          {" "}
          {firstName}
        </span>
      </h1>

      <p className="mt-3 text-lg text-white drop-shadow">
        {today}
      </p>
    </div>
  );
}

function getFirstName(fullName: string) {
  const trimmedName = fullName.trim();

  if (!trimmedName) {
    return "there";
  }

  return trimmedName.split(/\s+/)[0];
}