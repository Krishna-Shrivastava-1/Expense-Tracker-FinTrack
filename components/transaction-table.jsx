// components/transaction-table.jsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Edit2, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import React from "react";

export default function TransactionTable({ transactions }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(id);
    const { error } = await supabase.from("transaction").delete().eq("id", id);
    
    if (error) {
      alert(error.message);
      setDeletingId(null);
    } else {
      startTransition(() => {
        router.refresh();
      });
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
        No transactions found for this timeframe.
      </div>
    );
  }

  // 1. SEQUENCE SORT: Sort by date descending, then break ties using created_at descending
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.transaction_date).getTime();
    const dateB = new Date(b.transaction_date).getTime();

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  // 2. CALCULATE DAILY SPEND TOTALS (Only counts transactions where type is "expense")
  const dailySpendTotals = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      const dateStr = format(parseISO(t.transaction_date), "PP");
      acc[dateStr] = (acc[dateStr] || 0) + (Number(t.amount) || 0);
    }
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[45%]">Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((t, index) => {
            const isRowDeleting = deletingId === t.id || (isPending && deletingId === t.id);
            
            const currentDateStr = format(parseISO(t.transaction_date), "PP");
            const previousTransaction = sortedTransactions[index - 1];
            const previousDateStr = previousTransaction 
              ? format(parseISO(previousTransaction.transaction_date), "PP") 
              : null;
            
            const isFirstRowOfDate = currentDateStr !== previousDateStr;
            const totalDaySpend = dailySpendTotals[currentDateStr] || 0;

            return (
              <React.Fragment key={t.id}>
                {/* Visual Date & Spending Summary Separator Row */}
                {isFirstRowOfDate && (
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-2 select-none">
                    <TableCell colSpan={5} className="py-2 px-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                          {currentDateStr}
                        </span>
                        {totalDaySpend > 0 && (
                          <span className="text-xs font-medium text-destructive/90 bg-destructive/5 px-2 py-0.5 rounded border border-destructive/10">
                            Spent Today: ₹{totalDaySpend.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                <TableRow 
                  className={isRowDeleting ? "opacity-50 pointer-events-none transition-opacity" : "hover:bg-muted/10"}
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-sm">{t.title}</p>
                      {t.note && <p className="text-xs text-muted-foreground font-normal mt-0.5">{t.note}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.type === "income" ? "success" : "destructive"} className="capitalize">
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{t.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold tracking-tight ${t.type === "income" ? "text-emerald-600" : "text-destructive"}`}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={isRowDeleting}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          {isRowDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTransaction(t);
                            setIsEditDialogOpen(true);
                          }}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(t.id)}
                          className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      <AddTransactionDialog
        transaction={selectedTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        trigger={<span className="hidden" />} 
      />
    </div>
  );
}

// components/transaction-table.jsx
// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { format, parseISO } from "date-fns";
// import { Edit2, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
// import { createClient } from "@/utils/supabase/client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import AddTransactionDialog from "@/components/AddTransactionDialog";

// export default function TransactionTable({ transactions }) {
//   const supabase = createClient();
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
  
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this transaction?")) return;

//     setDeletingId(id);
//     const { error } = await supabase.from("transaction").delete().eq("id", id);
    
//     if (error) {
//       alert(error.message);
//       setDeletingId(null);
//     } else {
//       startTransition(() => {
//         router.refresh();
//       });
//       setDeletingId(null);
//     }
//   };

//   if (transactions.length === 0) {
//     return (
//       <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
//         No transactions found for this timeframe.
//       </div>
//     );
//   }

//   // 1. SEQUENCE SORT: Sort by date descending, then break ties using created_at descending
//   const sortedTransactions = [...transactions].sort((a, b) => {
//     const dateA = new Date(a.transaction_date).getTime();
//     const dateB = new Date(b.transaction_date).getTime();

//     if (dateB !== dateA) {
//       return dateB - dateA; // Primary: Latest date first
//     }

//     // Secondary: If same date, sort by entry creation timestamp (latest first)
//     const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
//     const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
//     return timeB - timeA;
//   });

//   return (
//     <div className="overflow-x-auto rounded-md border border-border">
//       <Table>
//         <TableHeader className="bg-muted/50">
//           <TableRow>
//             <TableHead className="w-[45%]">Title</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//             <TableHead className="w-[50px]"></TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {sortedTransactions.map((t, index) => {
//             const isRowDeleting = deletingId === t.id || (isPending && deletingId === t.id);
            
//             // 2. DATE GROUP VISUALS: Check if this row is the first entry of a new date
//             const currentDateStr = format(parseISO(t.transaction_date), "PP");
//             const previousTransaction = sortedTransactions[index - 1];
//             const previousDateStr = previousTransaction 
//               ? format(parseISO(previousTransaction.transaction_date), "PP") 
//               : null;
            
//             const isFirstRowOfDate = currentDateStr !== previousDateStr;

//             return (
//               <>
//                 {/* Visual Date Separator Row */}
//                 {isFirstRowOfDate && (
//                   <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-2 select-none">
//                     <TableCell colSpan={5} className="py-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
//                       {currentDateStr}
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 <TableRow 
//                   key={t.id} 
//                   className={isRowDeleting ? "opacity-50 pointer-events-none transition-opacity" : "hover:bg-muted/10"}
//                 >
//                   <TableCell className="font-medium">
//                     <div>
//                       <p className="text-sm">{t.title}</p>
//                       {t.note && <p className="text-xs text-muted-foreground font-normal mt-0.5">{t.note}</p>}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={t.type === "income" ? "success" : "destructive"} className="capitalize">
//                       {t.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline" className="font-normal">{t.category}</Badge>
//                   </TableCell>
//                   <TableCell className={`text-right font-semibold tracking-tight ${t.type === "income" ? "text-emerald-600" : "text-destructive"}`}>
//                     {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
//                   </TableCell>
//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild disabled={isRowDeleting}>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                           {isRowDeleting ? (
//                             <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                           ) : (
//                             <MoreHorizontal className="h-4 w-4" />
//                           )}
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={() => {
//                             setSelectedTransaction(t);
//                             setIsEditDialogOpen(true);
//                           }}
//                           className="gap-2 cursor-pointer"
//                         >
//                           <Edit2 className="h-3.5 w-3.5" />
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleDelete(t.id)}
//                           className="text-destructive focus:text-destructive gap-2 cursor-pointer"
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               </>
//             );
//           })}
//         </TableBody>
//       </Table>

//       <AddTransactionDialog
//         transaction={selectedTransaction}
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         trigger={<span className="hidden" />} 
//       />
//     </div>
//   );
// }