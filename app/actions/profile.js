// app/actions/profile.js
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData) {
  const supabase = await createClient();
  
  const fullName = formData.get("fullName");
  const avatarUrl = formData.get("avatarUrl");

  // Update user metadata inside Supabase Auth
  const { error } = await supabase.auth.updateUser({
    data: { 
      full_name: fullName,
      avatar_url: avatarUrl 
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Clear cache for the profile route so the client gets the fresh data instantly
  revalidatePath("/profile");
  return { success: true };
}