// app/actions/settings.js
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetAccountDataAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized access" };
  }

  // 1. Wipe all transactions belonging to this specific user ID
  const { error: txError } = await supabase
    .from("transaction")
    .delete()
    .eq("user_id", user.id);

  // 2. Wipe all budgets belonging to this specific user ID
  const { error: budgetError } = await supabase
    .from("budgets")
    .delete()
    .eq("user_id", user.id);

  if (txError || budgetError) {
    return { success: false, error: txError?.message || budgetError?.message };
  }

  // Clear data layouts across the system cache layers
  revalidatePath("/dashboard");
  return { success: true };
}