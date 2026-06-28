// // components/budget-tracker.jsx
// "use client";

// import { useState } from "react";
// import { Edit2 } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import SetBudgetDialog from "@/components/set-budget-dialog";

// export default function BudgetTracker({ budgets, transactions }) {
//   const [selectedBudget, setSelectedBudget] = useState(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

//   if (!budgets || budgets.length === 0) return null;

//   return (
//     <>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {budgets.map((budget) => {
//           const cutOffDate = new Date(budget.start_date);
          
//           const totalSpent = transactions
//             .filter((t) => {
//               const matchesType = t.type === "expense";
//               const matchesCategory = budget.category === "All" || t.category === budget.category;
//               const matchesDate = new Date(t.transaction_date) >= cutOffDate;
//               return matchesType && matchesCategory && matchesDate;
//             })
//             .reduce((sum, t) => sum + t.amount, 0);

//           const percentage = Math.min((totalSpent / budget.amount) * 100, 100);
//           const isOverBudget = totalSpent > budget.amount;

//           return (
//             <Card key={budget.id} className="shadow-sm border relative group">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-1">
//                     <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
//                       {budget.category} Budget
//                     </CardTitle>
//                     <span className="inline-block text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
//                       {budget.period}ly
//                     </span>
//                   </div>
                  
//                   {/* Edit action button trigger */}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
//                     onClick={() => {
//                       setSelectedBudget(budget);
//                       setIsEditDialogOpen(true);
//                     }}
//                   >
//                     <Edit2 className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//                 <CardDescription className="pt-1">
//                   Spent ₹{totalSpent.toLocaleString()} of ₹{budget.amount.toLocaleString()}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Progress 
//                   value={percentage} 
//                   className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`} 
//                 />
//                 <div className="flex justify-between items-center text-xs">
//                   <span className={isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
//                     {isOverBudget ? "Limit Breached!" : `${Math.round(percentage)}% Expended`}
//                   </span>
//                   <span className="font-medium">
//                     ₹{Math.max(0, budget.amount - totalSpent).toLocaleString()} Remaining
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Invisible dialog portal bound to track active edit state values */}
//       <SetBudgetDialog
//         budget={selectedBudget}
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         trigger={<span className="hidden" />}
//       />
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Edit2, Calendar } from "lucide-react";
// import { format, addMonths, addWeeks, subDays } from "date-fns";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import SetBudgetDialog from "@/components/set-budget-dialog";

// export default function BudgetTracker({ budgets, transactions }) {
//   const [selectedBudget, setSelectedBudget] = useState(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

//   if (!budgets || budgets.length === 0) return null;

//   return (
//     <>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {budgets.map((budget) => {
//           const cutOffDate = new Date(budget.start_date);
          
//           // 💡 Calculate the end date based on the period type
//           let endDate = new Date(budget.end_date || budget.start_date); 
//           if (!budget.end_date) {
//             if (budget.period?.toLowerCase() === "month") {
//               endDate = subDays(addMonths(cutOffDate, 1), 1);
//             } else if (budget.period?.toLowerCase() === "week") {
//               endDate = subDays(addWeeks(cutOffDate, 1), 1);
//             }
//           }

//           const totalSpent = transactions
//             .filter((t) => {
//               const matchesType = t.type === "expense";
//               const matchesCategory = budget.category === "All" || t.category === budget.category;
//               const matchesDate = new Date(t.transaction_date) >= cutOffDate;
//               return matchesType && matchesCategory && matchesDate;
//             })
//             .reduce((sum, t) => sum + t.amount, 0);

//           const percentage = Math.min((totalSpent / budget.amount) * 100, 100);
//           const isOverBudget = totalSpent > budget.amount;

//           return (
//             <Card key={budget.id} className="shadow-sm border relative group">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-1.5 w-full">
//                     <div className="flex items-center justify-between w-full">
//                       <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
//                         {budget.category} Budget
//                       </CardTitle>
                      
//                       {/* Action buttons wrapper */}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
//                         onClick={() => {
//                           setSelectedBudget(budget);
//                           setIsEditDialogOpen(true);
//                         }}
//                       >
//                         <Edit2 className="h-3.5 w-3.5" />
//                       </Button>
//                     </div>

//                     {/* Period Badge & Date Range Display Container */}
//                     <div className="flex flex-wrap items-center gap-2 pt-0.5">
//                       <span className="inline-block text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
//                         {budget.period}ly
//                       </span>
//                       <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
//                         <Calendar className="h-3 w-3" />
//                         {format(cutOffDate, "MMM dd, yyyy")} – {format(endDate, "MMM dd, yyyy")}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <CardDescription className="pt-2">
//                   Spent ₹{totalSpent.toLocaleString()} of ₹{budget.amount.toLocaleString()}
//                 </CardDescription>
//               </CardHeader>
              
//               <CardContent className="space-y-2">
//                 <Progress 
//                   value={percentage} 
//                   className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`} 
//                 />
//                 <div className="flex justify-between items-center text-xs">
//                   <span className={isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
//                     {isOverBudget ? "Limit Breached!" : `${Math.round(percentage)}% Expended`}
//                   </span>
//                   <span className="font-medium">
//                     ₹{Math.max(0, budget.amount - totalSpent).toLocaleString()} Remaining
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <SetBudgetDialog
//         budget={selectedBudget}
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         trigger={<span className="hidden" />}
//       />
//     </>
//   );
// }
"use client";

import { useState } from "react";
import { Edit2, Calendar, History, Wallet } from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay, addDays, addMonths, isBefore } from "date-fns"; 
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 💡 Added internal tabs
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import SetBudgetDialog from "@/components/set-budget-dialog";

export default function BudgetTracker({ budgets, transactions }) {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!budgets || budgets.length === 0) return null;

  // ==========================================
  // PROCESS ALL BUDGET DATA & TIMEFRAMES
  // ==========================================
  const processedBudgets = budgets.map((budget) => {
    const currentStart = startOfDay(new Date(budget.start_date || budget.created_at));
    let currentEnd;
    const periodType = budget.period?.toLowerCase();

    if (periodType === "week") {
      currentEnd = endOfDay(addDays(currentStart, 6)); 
    } else if (periodType === "month") {
      currentEnd = budget.end_date 
        ? endOfDay(new Date(budget.end_date)) 
        : endOfDay(addDays(addMonths(currentStart, 1), -1)); 
    } else {
      currentEnd = budget.end_date ? endOfDay(new Date(budget.end_date)) : endOfDay(currentStart);
    }

    const currentTransactions = (transactions || []).filter((t) => {
      const matchesType = t.type === "expense";
      const matchesCategory = budget.category === "All" || t.category === budget.category;
      return matchesType && matchesCategory && isWithinInterval(new Date(t.transaction_date), { start: currentStart, end: currentEnd });
    });

    const totalSpent = currentTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...budget,
      currentStart,
      currentEnd,
      totalSpent,
      percentage: Math.min((totalSpent / budget.amount) * 100, 100),
      isOverBudget: totalSpent > budget.amount,
      isExpired: isBefore(currentEnd, startOfDay(new Date()))
    };
  });

  // Separate active logs
  const activeBudgets = processedBudgets.filter(b => !b.isExpired);
  const historicalBudgets = processedBudgets.filter(b => b.isExpired);

  // 💡 Group historical data by period type
  const historyWeekly = historicalBudgets.filter(b => b.period?.toLowerCase() === "week");
  const historyMonthly = historicalBudgets.filter(b => b.period?.toLowerCase() === "month");
  const historyCustom = historicalBudgets.filter(b => b.period?.toLowerCase() !== "week" && b.period?.toLowerCase() !== "month");

  // Helper render function for history items to keep code clean
  const renderHistoryList = (list) => {
    if (list.length === 0) {
      return <p className="text-xs text-muted-foreground text-center py-12">No past records in this category.</p>;
    }
    return (
      <div className="space-y-3 pt-2">
        {list.map((budget) => (
          <Card key={budget.id} className="shadow-none border bg-muted/20 opacity-90">
            <CardHeader className="p-3 pb-1.5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {budget.category}
                  </CardTitle>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                    <Calendar className="h-2.5 w-2.5" />
                    {format(budget.currentStart, "MMM dd")} – {format(budget.currentEnd, "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
              <CardDescription className="pt-2 text-xs font-semibold text-foreground">
                Spent ₹{budget.totalSpent.toLocaleString()} of ₹{budget.amount.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-1.5">
              <Progress 
                value={budget.percentage} 
                className={`h-1.5 ${budget.isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-slate-400"}`} 
              />
              <div className="flex justify-between items-center text-[10px]">
                <span className={budget.isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
                  {budget.isOverBudget ? "Limit Breached!" : "Completed"}
                </span>
                <span className="font-medium text-muted-foreground">
                  {budget.isOverBudget 
                    ? `Over by ₹${(budget.totalSpent - budget.amount).toLocaleString()}`
                    : `₹${Math.max(0, budget.amount - budget.totalSpent).toLocaleString()} Left`
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Active Budgets</h2>
            <p className="text-xs text-muted-foreground">Your currently running tracking cycles.</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-xs font-medium">
                <History className="h-3.5 w-3.5" />
                History ({historicalBudgets.length})
              </Button>
            </SheetTrigger>
            
           <SheetContent 
  side="right" 
  className="w-full sm:max-w-md h-full overflow-y-auto duration-200 p-3 md:p-6"
>
  <SheetHeader className="pb-4 border-b">
    <SheetTitle className="flex items-center gap-2 text-base md:text-lg">
      <History className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" /> Budget History
    </SheetTitle>
    <SheetDescription className="text-xs">
      Review your performance across different cycle tracking types.
    </SheetDescription>
  </SheetHeader>

  {/* Sub-Tabs container */}
  <div className="w-full pt-2">
    <Tabs defaultValue="weekly" className="w-full">
      <TabsList className="grid w-full grid-cols-3 text-[11px] h-8 p-0.5 mb-4">
        <TabsTrigger value="weekly" className="text-xs py-1">Weekly ({historyWeekly.length})</TabsTrigger>
        <TabsTrigger value="monthly" className="text-xs py-1">Monthly ({historyMonthly.length})</TabsTrigger>
        <TabsTrigger value="custom" className="text-xs py-1">Custom ({historyCustom.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="weekly" className="focus-visible:outline-none">
        {renderHistoryList(historyWeekly)}
      </TabsContent>
      <TabsContent value="monthly" className="focus-visible:outline-none">
        {renderHistoryList(historyMonthly)}
      </TabsContent>
      <TabsContent value="custom" className="focus-visible:outline-none">
        {renderHistoryList(historyCustom)}
      </TabsContent>
    </Tabs>
  </div>
</SheetContent>
          </Sheet>
        </div>

        {/* ACTIVE MAIN GRID */}
        {activeBudgets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12 bg-muted/10 rounded-xl border border-dashed">
            No active tracking cycles running right now.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeBudgets.map((budget) => (
              <Card key={budget.id} className="shadow-sm border relative group flex flex-col justify-between h-full">
                <div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-between w-full">
                          <CardTitle className="text-sm font-semibold uppercase tracking-wider">
                            {budget.category} Budget
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
                            onClick={() => { setSelectedBudget(budget); setIsEditDialogOpen(true); }}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="inline-block text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                            {budget.period === "custom" ? "Custom" : `${budget.period}ly`}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                            <Calendar className="h-3 w-3" />
                            {format(budget.currentStart, "MMM dd")} – {format(budget.currentEnd, "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="pt-2 text-foreground font-medium">
                      Spent ₹{budget.totalSpent.toLocaleString()} of ₹{budget.amount.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-4">
                    <Progress value={budget.percentage} className={`h-2 ${budget.isOverBudget ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`} />
                    <div className="flex justify-between items-center text-xs">
                      <span className={budget.isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"}>
                        {budget.isOverBudget ? "Limit Breached!" : `${Math.round(budget.percentage)}% Expended`}
                      </span>
                      <span className="font-medium text-muted-foreground">
                        ₹{Math.max(0, budget.amount - budget.totalSpent).toLocaleString()} Remaining
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SetBudgetDialog budget={selectedBudget} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} trigger={<span className="hidden" />} />
    </>
  );
}