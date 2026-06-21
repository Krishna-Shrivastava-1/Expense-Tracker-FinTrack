// components/profile-form.jsx
"use client";

import { useTransition } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ProfileForm({ user }) {
  const [isPending, startTransition] = useTransition();

  // Extract initial values from Supabase user metadata object safely
  const initialName = user?.user_metadata?.full_name || "";
  const initialAvatar = user?.user_metadata?.avatar_url || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result?.success) {
        alert("Profile updated successfully!");
      } else if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-sm border">
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Update your personal display information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-Only Account Data */}
          <div className="grid gap-2">
            <Label className="text-muted-foreground">Registered Email</Label>
            <Input type="text" value={user?.email || ""} disabled className="bg-muted opacity-80" />
          </div>

          <div className="grid gap-2">
            <Label className="text-muted-foreground">Account User ID (UUID)</Label>
            <Input type="text" value={user?.id || ""} disabled className="bg-muted opacity-80 text-xs font-mono" />
          </div>

          <hr className="border-t" />

          {/* Editable Metadata Fields */}
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={initialName}
              placeholder="e.g. John Doe"
              disabled={isPending}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="avatarUrl">Avatar Image URL</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              defaultValue={initialAvatar}
              placeholder="https://example.com/avatar.png"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}