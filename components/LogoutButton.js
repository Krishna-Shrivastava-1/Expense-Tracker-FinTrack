"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth"; // 💡 Import the action
import { Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isPending}
      variant="destructive"
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? "Signing Out..." : "Logout"}
    </Button>
  );
}