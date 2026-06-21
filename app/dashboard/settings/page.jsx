// app/(protected)/settings/page.jsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings-form";

export const metadata = {
  title: "Preferences - FinTrack Platform",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preferences Settings</h1>
        <p className="text-muted-foreground">Manage your analytics presets and system configs.</p>
      </div>

      {/* Render settings management module layout views */}
      <SettingsForm />
    </div>
  );
}