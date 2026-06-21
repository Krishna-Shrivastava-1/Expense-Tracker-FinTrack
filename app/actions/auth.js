// app/actions/auth.js
"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const supabase = await createClient();
  
  // 1. Terminate the active database session session 
  await supabase.auth.signOut();
  
  // 2. Explicitly wipe out any browser auth cookies 
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  allCookies.forEach((cookie) => {
    if (cookie.name.includes("-auth-token") || cookie.name.startsWith("sb-")) {
      cookieStore.set(cookie.name, "", {
        path: "/",
        expires: new Date(0), // Instantly invalidates the cookie
        maxAge: 0,
      });
    }
  });

  // 3. Perform a clean redirect now that the cookies are completely gone
  redirect("/login");
}