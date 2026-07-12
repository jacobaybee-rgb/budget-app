import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string;
  avatar_url: string | null;
  currency: string;
  budget_cycle: string;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdate = {
  full_name?: string;
  avatar_url?: string | null;
  currency?: string;
  budget_cycle?: string;
};

const PROFILE_COLUMNS = `
  id,
  email,
  full_name,
  avatar_url,
  currency,
  budget_cycle,
  created_at,
  updated_at
`;

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(`Unable to load profile: ${error.message}`);
  }

  return data as Profile;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select(PROFILE_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Unable to update profile: ${error.message}`);
  }

  return data as Profile;
}