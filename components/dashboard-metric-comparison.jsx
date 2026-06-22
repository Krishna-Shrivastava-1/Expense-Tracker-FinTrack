// components/dashboard-metric-comparison.jsx
"use client";

import { ArrowDownIcon, ArrowUpIcon, PercentIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DashboardMetricComparison({ currentSpend, previousSpend, title = "Weekly Spending" }) {
  // Prevent division by zero
  const calculatePercentageDifference = () => {
    if (!previousSpend || previousSpend === 0) return 0;
    const diff = ((currentSpend - previousSpend) / previousSpend) * 100;
    return Math.round(diff);
  };

  const percentage = calculatePercentageDifference();
  const isLess = percentage < 0;
  const isZero = percentage === 0;

  return (
    <Card className="w-full sm:max-w-sm shadow-sm transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-full text-xs",
          isLess ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : 
          isZero ? "bg-muted text-muted-foreground" : 
          "bg-destructive/10 text-destructive"
        )}>
          {isLess ? <ArrowDownIcon className="h-4 w-4" /> : isZero ? <PercentIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />}
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Spending Total */}
        <div className="text-2xl font-bold tracking-tight">
          ₹{currentSpend.toLocaleString("en-IN")}
        </div>

        {/* Dynamic Comparison Subtitle */}
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
          {!isZero ? (
            <>
              <span className={cn(
                "font-semibold px-1.5 py-0.5 rounded text-[11px]",
                isLess ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
              )}>
                {Math.abs(percentage)}% {isLess ? "less" : "more"}
              </span>
              <span>than previous period (₹{previousSpend.toLocaleString("en-IN")})</span>
            </>
          ) : (
            <span>Same as previous period</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}