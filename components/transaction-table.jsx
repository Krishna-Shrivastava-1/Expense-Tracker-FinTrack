// components/transaction-table.jsx
"use client";

import { useState, useTransition } from "react"; // 💡 Added useTransition
import { useRouter } from "next/navigation";     // 💡 Added useRouter
import { format, parseISO } from "date-fns";
import { Edit2, MoreHorizontal, Trash2, Loader2 } from "lucide-react"; // Added Loader2
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

export default function TransactionTable({ transactions }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // 💡 High-performance UI transition tracking
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track exactly which row is deleting

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(id);
    const { error } = await supabase.from("transaction").delete().eq("id", id);
    
    if (error) {
      alert(error.message);
      setDeletingId(null);
    } else {
      // 💡 Seamless background re-validation without a full page flash
      startTransition(() => {
        router.refresh();
      });
      // Safety reset after the transition completes
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const isRowDeleting = deletingId === t.id || (isPending && deletingId === t.id);

            return (
              <TableRow key={t.id} className={isRowDeleting ? "opacity-50 pointer-events-none transition-opacity" : ""}>
                <TableCell className="font-medium">
                  <div>
                    <p>{t.title}</p>
                    {t.note && <p className="text-xs text-muted-foreground font-normal">{t.note}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={t.type === "income" ? "success" : "destructive"}>
                    {t.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{t.category}</Badge>
                </TableCell>
                <TableCell>{format(parseISO(t.transaction_date), "PP")}</TableCell>
                <TableCell className={`text-right font-semibold ${t.type === "income" ? "text-emerald-600" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
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
            );
          })}
        </TableBody>
      </Table>

      {/* Hidden Dialog Trigger bound to the table state */}
      <AddTransactionDialog
        transaction={selectedTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        trigger={<span className="hidden" />} 
      />
    </div>
  );
}