// // components/set-budget-dialog.jsx
// "use client";

// import { useEffect, useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Trash2, Loader2 } from "lucide-react"; // Added Loader2 for smooth button transitions
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
//   AlertDialogFooter,
//   AlertDialogCancel,
// } from "@/components/ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function SetBudgetDialog({ budget, open: controlledOpen, onOpenChange, trigger }) {
//   const supabase = createClient();
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition(); // 💡 High-performance UI transition tracking
//   const isEditing = !!budget;

//   const [internalOpen, setInternalOpen] = useState(false);
//   const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

//   const [loading, setLoading] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [period, setPeriod] = useState("month");
//   const [category, setCategory] = useState("All");

//   // Sync state values when modal pops open
//   useEffect(() => {
//     if (budget) {
//       setAmount(budget.amount?.toString() || "");
//       setPeriod(budget.period || "month");
//       setCategory(budget.category || "All");
//     } else {
//       setAmount("");
//       setPeriod("month");
//       setCategory("All");
//     }
//   }, [budget, open]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return alert("Please login first");

//     const payload = {
//       user_id: user.id,
//       amount: Number(amount),
//       period,
//       category,
//       start_date: isEditing ? budget.start_date : new Date().toISOString(),
//     };

//     let error;
//     if (isEditing) {
//       const res = await supabase.from("budgets").update(payload).eq("id", budget.id);
//       error = res.error;
//     } else {
//       const res = await supabase.from("budgets").insert(payload);
//       error = res.error;
//     }

//     setLoading(false);
//     if (error) {
//       alert(error.message);
//     } else {
//       setOpen(false); // Close dialog overlay immediately
      
//       // 💡 Background re-validation (No layout disruption or hard refresh flashes)
//       startTransition(() => {
//         router.refresh();
//       });
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm(`Are you sure you want to delete the ${budget.category} budget?`)) return;
//     setLoading(true);

//     const { error } = await supabase.from("budgets").delete().eq("id", budget.id);
    
//     setLoading(false);
//     if (error) {
//       alert(error.message);
//     } else {
//       setOpen(false); // Close modal right away
      
//       // 💡 Smoothly refresh database views
//       startTransition(() => {
//         router.refresh();
//       });
//     }
//   };

//   const isWorking = loading || isPending;

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       {trigger ? trigger : (
//         <AlertDialogTrigger asChild>
//           <Button variant="outline">Set Budget Limit</Button>
//         </AlertDialogTrigger>
//       )}
//       <AlertDialogContent className="max-w-md">
//         <AlertDialogHeader>
//           <AlertDialogTitle>
//             {isEditing ? `Modify ${budget.category} Budget` : "Set Financial Limit"}
//           </AlertDialogTitle>
//         </AlertDialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label>Budget Limit Target Amount (₹)</Label>
//             <Input
//               type="number"
//               placeholder="e.g. 1200"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               disabled={isWorking}
//             />
//           </div>
//           <div>
//             <Label>Time Period Window</Label>
//             <Select value={period} onValueChange={setPeriod} disabled={isEditing || isWorking}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="week">Weekly</SelectItem>
//                 <SelectItem value="month">Monthly</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label>Scope / Category</Label>
//             <Select value={category} onValueChange={setCategory} disabled={isEditing || isWorking}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="All">All Expenses (Global)</SelectItem>
//                 <SelectItem value="Food">Food</SelectItem>
//                 <SelectItem value="Shopping">Shopping</SelectItem>
//                 <SelectItem value="Bills">Bills</SelectItem>
//                 <SelectItem value="Entertainment">Entertainment</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <AlertDialogFooter className="flex items-center justify-between w-full sm:justify-between pt-2">
//             {isEditing ? (
//               <Button 
//                 type="button" 
//                 variant="destructive" 
//                 size="icon" 
//                 onClick={handleDelete} 
//                 disabled={isWorking}
//               >
//                 {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
//               </Button>
//             ) : <div />}
//             <div className="flex gap-2">
//               <AlertDialogCancel type="button" disabled={isWorking}>Cancel</AlertDialogCancel>
//               <Button type="submit" disabled={isWorking}>
//                 {isWorking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {isWorking ? "Syncing..." : isEditing ? "Update" : "Apply Budget"}
//               </Button>
//             </div>
//           </AlertDialogFooter>
//         </form>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }



"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [isPending, startTransition] = useTransition();
  const isEditing = !!budget;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("month");
  const [category, setCategory] = useState("All");
  
  // 💡 Shadcn Calendar range state object
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (budget) {
      setAmount(budget.amount?.toString() || "");
      setPeriod(budget.period || "month");
      setCategory(budget.category || "All");
      
      // Parse dates into valid Date objects for Shadcn Calendar if editing
      setDateRange({
        from: budget.start_date ? new Date(budget.start_date) : undefined,
        to: budget.end_date ? new Date(budget.end_date) : undefined,
      });
    } else {
      setAmount("");
      setPeriod("month");
      setCategory("All");
      setDateRange({ from: undefined, to: undefined });
    }
  }, [budget, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login first");

    if (period === "custom" && (!dateRange?.from || !dateRange?.to)) {
      setLoading(false);
      return alert("Please pick both start and end dates from the calendar window.");
    }

    const payload = {
      user_id: user.id,
      amount: Number(amount),
      period,
      category,
      start_date: period === "custom" 
        ? dateRange.from.toISOString() 
        : (isEditing ? budget.start_date : new Date().toISOString()),
      end_date: period === "custom" ? dateRange.to.toISOString() : null,
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
      setOpen(false);
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
      setOpen(false);
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
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DYNAMIC WINDOW: Shadcn Popover + Range Calendar */}
          {period === "custom" && (
            <div className="flex flex-col gap-2 animate-in fade-in-50 duration-200">
              <Label>Select Custom Time Block Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    disabled={isEditing || isWorking}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, yyyy")} -{" "}
                          {format(dateRange.to, "LLL dd, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, yyyy")
                      )
                    ) : (
                      <span>Pick a custom date window range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

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