// components/set-budget-dialog.jsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2 } from "lucide-react"; // Added Loader2 for smooth button transitions
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SetBudgetDialog({ budget, open: controlledOpen, onOpenChange, trigger }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // 💡 High-performance UI transition tracking
  const isEditing = !!budget;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("month");
  const [category, setCategory] = useState("All");

  // Sync state values when modal pops open
  useEffect(() => {
    if (budget) {
      setAmount(budget.amount?.toString() || "");
      setPeriod(budget.period || "month");
      setCategory(budget.category || "All");
    } else {
      setAmount("");
      setPeriod("month");
      setCategory("All");
    }
  }, [budget, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login first");

    const payload = {
      user_id: user.id,
      amount: Number(amount),
      period,
      category,
      start_date: isEditing ? budget.start_date : new Date().toISOString(),
    };

    let error;
    if (isEditing) {
      const res = await supabase.from("budgets").update(payload).eq("id", budget.id);
      error = res.error;
    } else {
      const res = await supabase.from("budgets").insert(payload);
      error = res.error;
    }

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setOpen(false); // Close dialog overlay immediately
      
      // 💡 Background re-validation (No layout disruption or hard refresh flashes)
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the ${budget.category} budget?`)) return;
    setLoading(true);

    const { error } = await supabase.from("budgets").delete().eq("id", budget.id);
    
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setOpen(false); // Close modal right away
      
      // 💡 Smoothly refresh database views
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const isWorking = loading || isPending;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? trigger : (
        <AlertDialogTrigger asChild>
          <Button variant="outline">Set Budget Limit</Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditing ? `Modify ${budget.category} Budget` : "Set Financial Limit"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Budget Limit Target Amount (₹)</Label>
            <Input
              type="number"
              placeholder="e.g. 1200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isWorking}
            />
          </div>
          <div>
            <Label>Time Period Window</Label>
            <Select value={period} onValueChange={setPeriod} disabled={isEditing || isWorking}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Scope / Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isEditing || isWorking}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Expenses (Global)</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter className="flex items-center justify-between w-full sm:justify-between pt-2">
            {isEditing ? (
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={handleDelete} 
                disabled={isWorking}
              >
                {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <AlertDialogCancel type="button" disabled={isWorking}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isWorking}>
                {isWorking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isWorking ? "Syncing..." : isEditing ? "Update" : "Apply Budget"}
              </Button>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}