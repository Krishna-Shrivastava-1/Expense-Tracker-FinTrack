// components/settings-form.jsx
"use client";

import { useTransition, useEffect, useState } from "react";
import { useTheme } from "@teispace/next-themes"
import { resetAccountDataAction } from "@/app/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Prevent hydration mismatches when managing dynamic client client theme states
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDataReset = () => {
    const confirmation = confirm(
      "CRITICAL WARNING:\n\nThis will permanently delete ALL of your transactions and active budgets from our database. This action cannot be undone.\n\nAre you absolutely sure?"
    );

    if (!confirmation) return;

    startTransition(async () => {
      const result = await resetAccountDataAction();
      if (result?.success) {
        alert("Account metrics cleared out completely.");
      } else if (result?.error) {
        alert(`Error clearing data: ${result.error}`);
      }
    });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 1. Theme Configuration Card */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Appearance Preferences</CardTitle>
          <CardDescription>Customize the visual interface skin of your active session views.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="theme-select">Interface Theme Mode</Label>
            <Select value={theme} onValueChange={(val) => setTheme(val)}>
              <SelectTrigger id="theme-select" className="w-full sm:w-64">
                <SelectValue placeholder="Select interface mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light Mode</SelectItem>
                <SelectItem value="dark">Dark Mode</SelectItem>
                <SelectItem value="system">Follow System Defaults</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Platform Regional Localization Card */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Localization Settings</CardTitle>
          <CardDescription>Adjust default currency formats used across chart logs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="currency-select">Primary Currency Unit</Label>
            <Select defaultValue="INR">
              <SelectTrigger id="currency-select" className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="GBP">British Pound (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 3. Danger Zone Reset Management */}
      <Card className="shadow-sm border border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">
            Irreversible maintenance actions for your accounting logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Purge Analytical Ledger Data</p>
              <p className="text-xs text-muted-foreground max-w-md">
                Instantly clean out your database collections. Your authentication profile remains intact.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDataReset}
              disabled={isPending}
              className="w-full sm:w-auto shrink-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wiping Data...
                </>
              ) : (
                "Reset Account Data"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}