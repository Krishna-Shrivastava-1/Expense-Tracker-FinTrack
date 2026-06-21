// app/(protected)/profile/page.jsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile-form";

export const metadata = {
  title: "Your Profile - Finance Tracker",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If no session exists, bounce safely out to log in via layout middleware tracking rules
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your credentials and look profile configurations.</p>
      </div>

      {/* Render the profile client update view form */}
      <ProfileForm user={user} />
    </div>
  );
}