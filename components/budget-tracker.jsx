// components/budget-tracker.jsx
"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SetBudgetDialog from "@/components/set-budget-dialog";

export default function BudgetTracker({ budgets, transactions }) {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!budgets || budgets.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const cutOffDate = new Date(budget.start_date);
          
          const totalSpent = transactions
            .filter((t) => {
              const matchesType = t.type === "expense";
              const matchesCategory = budget.category === "All" || t.category === budget.category;
              const matchesDate = new Date(t.transaction_date) >= cutOffDate;
              return matchesType && matchesCategory && matchesDate;
            })
            .reduce((sum, t) => sum + t.amount, 0);

          const percentage = Math.min((totalSpent / budget.amount) * 100, 100);
          const isOverBudget = totalSpent > budget.amount;

          return (
            <Card key={budget.id} className="shadow-sm border relative group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                      {budget.category} Budget
                    </CardTitle>
                    <span className="inline-block text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {budget.period}ly
                    </span>
                  </div>
                  
                  {/* Edit action button trigger */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setSelectedBudget(budget);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <CardDescription className="pt-1">
                  Spent ₹{totalSpent.toLocaleString()} of ₹{budget.amount.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`} 
                />
                <div className="flex justify-between items-center text-xs">
                  <span className={isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
                    {isOverBudget ? "Limit Breached!" : `${Math.round(percentage)}% Expended`}
                  </span>
                  <span className="font-medium">
                    ₹{Math.max(0, budget.amount - totalSpent).toLocaleString()} Remaining
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invisible dialog portal bound to track active edit state values */}
      <SetBudgetDialog
        budget={selectedBudget}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        trigger={<span className="hidden" />}
      />
    </>
  );
}