// components/transaction-table.jsx
"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

const ITEMS_PER_PAGE = 7;

export default function TransactionTable({ initialTransactions = [] }) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const activeRange = searchParams.get("range") || "all"; 
  const customFrom = searchParams.get("from");
  const customTo = searchParams.get("to");

  const [transactions, setTransactions] = useState(initialTransactions);
  const [hasMore, setHasMore] = useState(initialTransactions.length >= ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const observerTargetRef = useRef(null);

  // 🔄 Sync Server updates (initialTransactions) with Client State (transactions)
  useEffect(() => {
    setTransactions((prev) => {
      const merged = [...initialTransactions];
      const newIds = new Set(initialTransactions.map((t) => t.id));

      for (const tx of prev) {
        if (!newIds.has(tx.id)) {
          merged.push(tx);
        }
      }
      return merged;
    });
  }, [initialTransactions]);

  const loadMoreTransactions = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const fromIndex = transactions.length;
    const toIndex = fromIndex + ITEMS_PER_PAGE - 1;

    try {
      let query = supabase
        .from("transaction")
        .select("*")
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (activeRange === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        query = query.gte("transaction_date", start.toISOString()).lte("transaction_date", end.toISOString());
      } 
      else if (activeRange === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        query = query.gte("transaction_date", sevenDaysAgo.toISOString());
      } 
      else if (activeRange === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        query = query.gte("transaction_date", thirtyDaysAgo.toISOString());
      } 
      else if (activeRange === "custom" && customFrom && customTo) {
        const startDate = new Date(customFrom);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(customTo);
        endDate.setHours(23, 59, 59, 999);

        query = query
          .gte("transaction_date", startDate.toISOString())
          .lte("transaction_date", endDate.toISOString());
      }

      const { data, error } = await query.range(fromIndex, toIndex);

      if (error) throw error;

      if (!data || data.length < ITEMS_PER_PAGE) {
        setHasMore(false); 
      }
      if (data && data.length > 0) {
        setTransactions((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const filteredNewData = data.filter((t) => !existingIds.has(t.id));
          return [...prev, ...filteredNewData];
        });
      }
    } catch (err) {
      console.error("Infinite scroll error:", err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreTransactions();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, transactions.length, isLoadingMore, activeRange, customFrom, customTo]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(id);
    const { error } = await supabase.from("transaction").delete().eq("id", id);

    if (error) {
      alert(error.message);
      setDeletingId(null);
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      startTransition(() => {
        router.refresh();
      });
      setDeletingId(null);
    }
  };

  if (transactions.length === 0 && !isLoadingMore) {
    return (
      <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
        No transactions found for this timeframe.
      </div>
    );
  }

  // Sorting logic: Days are descending (newest day first).
  // Within the same day, transactions are also descending (newest transaction first).
  const sortedTransactions = [...transactions].sort((a, b) => {
    // Group strictly by calendar date (ignoring timezone variations or timestamp differences)
    const dateAStr = format(parseISO(a.transaction_date), "yyyy-MM-dd");
    const dateBStr = format(parseISO(b.transaction_date), "yyyy-MM-dd");

    if (dateAStr !== dateBStr) {
      return dateBStr.localeCompare(dateAStr); // Newest day first
    }

    // Within the same day, sort in descending chronological order
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA; // Newest transaction (entered last) appears first
  });

  const dailySpendTotals = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      const dateStr = format(parseISO(t.transaction_date), "PP");
      acc[dateStr] = (acc[dateStr] || 0) + (Number(t.amount) || 0);
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4">
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

                  <TableRow className={isRowDeleting ? "opacity-50 pointer-events-none transition-opacity" : "hover:bg-muted/10"}>
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

            {hasMore && (
              <TableRow ref={observerTargetRef} className="hover:bg-transparent border-none">
                <TableCell colSpan={5} className="py-4 text-center">
                  {isLoadingMore && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Fetching additional records...
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddTransactionDialog
        transaction={selectedTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        trigger={<span className="hidden" />}
      />
    </div>
  );
}
// // components/transaction-table.jsx
// "use client";

// import React, { useState, useEffect, useRef, useTransition } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
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

// const ITEMS_PER_PAGE = 7;

// export default function TransactionTable({ initialTransactions = [] }) {
//   const supabase = createClient();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
  
//   const activeRange = searchParams.get("range") || "all"; 
//   const customFrom = searchParams.get("from");
//   const customTo = searchParams.get("to");

//   const [transactions, setTransactions] = useState(initialTransactions);
//   const [hasMore, setHasMore] = useState(initialTransactions.length >= ITEMS_PER_PAGE);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const observerTargetRef = useRef(null);

//   // 🔄 Sync Server updates (initialTransactions) with Client State (transactions)
//   useEffect(() => {
//     setTransactions((prev) => {
//       // 1. Keep the new initial transactions (first page) as the baseline
//       const merged = [...initialTransactions];
//       const newIds = new Set(initialTransactions.map((t) => t.id));

//       // 2. Append existing items from state that aren't in the new page
//       for (const tx of prev) {
//         if (!newIds.has(tx.id)) {
//           merged.push(tx);
//         }
//       }
//       return merged;
//     });
//   }, [initialTransactions]);

//   const loadMoreTransactions = async () => {
//     if (isLoadingMore || !hasMore) return;
//     setIsLoadingMore(true);

//     const fromIndex = transactions.length;
//     const toIndex = fromIndex + ITEMS_PER_PAGE - 1;

//     try {
//       let query = supabase
//         .from("transaction")
//         .select("*")
//         .order("transaction_date", { ascending: false })
//         .order("created_at", { ascending: false });

//       if (activeRange === "today") {
//         const start = new Date();
//         start.setHours(0, 0, 0, 0);
//         const end = new Date();
//         end.setHours(23, 59, 59, 999);
//         query = query.gte("transaction_date", start.toISOString()).lte("transaction_date", end.toISOString());
//       } 
//       else if (activeRange === "7days") {
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//         sevenDaysAgo.setHours(0, 0, 0, 0);
//         query = query.gte("transaction_date", sevenDaysAgo.toISOString());
//       } 
//       else if (activeRange === "30days") {
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//         thirtyDaysAgo.setHours(0, 0, 0, 0);
//         query = query.gte("transaction_date", thirtyDaysAgo.toISOString());
//       } 
//       else if (activeRange === "custom" && customFrom && customTo) {
//         const startDate = new Date(customFrom);
//         startDate.setHours(0, 0, 0, 0);
        
//         const endDate = new Date(customTo);
//         endDate.setHours(23, 59, 59, 999);

//         query = query
//           .gte("transaction_date", startDate.toISOString())
//           .lte("transaction_date", endDate.toISOString());
//       }

//       const { data, error } = await query.range(fromIndex, toIndex);

//       if (error) throw error;

//       if (!data || data.length < ITEMS_PER_PAGE) {
//         setHasMore(false); 
//       }
//       if (data && data.length > 0) {
//         setTransactions((prev) => {
//           const existingIds = new Set(prev.map((t) => t.id));
//           const filteredNewData = data.filter((t) => !existingIds.has(t.id));
//           return [...prev, ...filteredNewData];
//         });
//       }
//     } catch (err) {
//       console.error("Infinite scroll error:", err.message);
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     const target = observerTargetRef.current;
//     if (!target || !hasMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
//           loadMoreTransactions();
//         }
//       },
//       { threshold: 0.1, rootMargin: "50px" }
//     );

//     observer.observe(target);

//     return () => {
//       if (target) observer.unobserve(target);
//     };
//   }, [hasMore, transactions.length, isLoadingMore, activeRange, customFrom, customTo]);

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this transaction?")) return;

//     setDeletingId(id);
//     const { error } = await supabase.from("transaction").delete().eq("id", id);

//     if (error) {
//       alert(error.message);
//       setDeletingId(null);
//     } else {
//       // Optimistically remove from state and tell Next.js to refresh other dashboard cards
//       setTransactions((prev) => prev.filter((t) => t.id !== id));
//       startTransition(() => {
//         router.refresh();
//       });
//       setDeletingId(null);
//     }
//   };

//   if (transactions.length === 0 && !isLoadingMore) {
//     return (
//       <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
//         No transactions found for this timeframe.
//       </div>
//     );
//   }

//   const sortedTransactions = [...transactions].sort((a, b) => {
//     const dateA = new Date(a.transaction_date).getTime();
//     const dateB = new Date(b.transaction_date).getTime();
//     if (dateB !== dateA) return dateB - dateA;
//     const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
//     const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
//     return timeB - timeA;
//   });

//   const dailySpendTotals = transactions.reduce((acc, t) => {
//     if (t.type === "expense") {
//       const dateStr = format(parseISO(t.transaction_date), "PP");
//       acc[dateStr] = (acc[dateStr] || 0) + (Number(t.amount) || 0);
//     }
//     return acc;
//   }, {});

//   return (
//     <div className="space-y-4">
//       <div className="overflow-x-auto rounded-md border border-border">
//         <Table>
//           <TableHeader className="bg-muted/50">
//             <TableRow>
//               <TableHead className="w-[45%]">Title</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead className="text-right">Amount</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {sortedTransactions.map((t, index) => {
//               const isRowDeleting = deletingId === t.id || (isPending && deletingId === t.id);
//               const currentDateStr = format(parseISO(t.transaction_date), "PP");
//               const previousTransaction = sortedTransactions[index - 1];
//               const previousDateStr = previousTransaction
//                 ? format(parseISO(previousTransaction.transaction_date), "PP")
//                 : null;

//               const isFirstRowOfDate = currentDateStr !== previousDateStr;
//               const totalDaySpend = dailySpendTotals[currentDateStr] || 0;

//               return (
//                 <React.Fragment key={t.id}>
//                   {isFirstRowOfDate && (
//                     <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-2 select-none">
//                       <TableCell colSpan={5} className="py-2 px-4">
//                         <div className="flex items-center justify-between w-full">
//                           <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
//                             {currentDateStr}
//                           </span>
//                           {totalDaySpend > 0 && (
//                             <span className="text-xs font-medium text-destructive/90 bg-destructive/5 px-2 py-0.5 rounded border border-destructive/10">
//                               Spent Today: ₹{totalDaySpend.toLocaleString("en-IN")}
//                             </span>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   )}

//                   <TableRow className={isRowDeleting ? "opacity-50 pointer-events-none transition-opacity" : "hover:bg-muted/10"}>
//                     <TableCell className="font-medium">
//                       <div>
//                         <p className="text-sm">{t.title}</p>
//                         {t.note && <p className="text-xs text-muted-foreground font-normal mt-0.5">{t.note}</p>}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={t.type === "income" ? "success" : "destructive"} className="capitalize">
//                         {t.type}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="font-normal">{t.category}</Badge>
//                     </TableCell>
//                     <TableCell className={`text-right font-semibold tracking-tight ${t.type === "income" ? "text-emerald-600" : "text-destructive"}`}>
//                       {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
//                     </TableCell>
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild disabled={isRowDeleting}>
//                           <Button variant="ghost" className="h-8 w-8 p-0">
//                             {isRowDeleting ? (
//                               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                             ) : (
//                               <MoreHorizontal className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setSelectedTransaction(t);
//                               setIsEditDialogOpen(true);
//                             }}
//                             className="gap-2 cursor-pointer"
//                           >
//                             <Edit2 className="h-3.5 w-3.5" />
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleDelete(t.id)}
//                             className="text-destructive focus:text-destructive gap-2 cursor-pointer"
//                           >
//                             <Trash2 className="h-3.5 w-3.5" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 </React.Fragment>
//               );
//             })}

//             {hasMore && (
//               <TableRow ref={observerTargetRef} className="hover:bg-transparent border-none">
//                 <TableCell colSpan={5} className="py-4 text-center">
//                   {isLoadingMore && (
//                     <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//                       <Loader2 className="h-4 w-4 animate-spin" /> Fetching additional records...
//                     </div>
//                   )}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <AddTransactionDialog
//         transaction={selectedTransaction}
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         trigger={<span className="hidden" />}
//       />
//     </div>
//   );
// }