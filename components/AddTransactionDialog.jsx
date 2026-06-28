// "use client";

// import { useEffect, useState } from "react";
// import { format } from "date-fns";
// import { CalendarIcon, Check, ChevronsUpDown, RotateCcw } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { createClient } from "@/utils/supabase/client";

// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
//   AlertDialogFooter,
//   AlertDialogCancel,
// } from "@/components/ui/alert-dialog";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import { Calendar } from "@/components/ui/calendar";

// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandSeparator,
// } from "@/components/ui/command";

// const DEFAULT_CATEGORIES = [
//   "Food",
//   "Transport",
//   "Shopping",
//   "Bills",
//   "Health",
//   "Education",
//   "Entertainment",
//   "Salary",
//   "Other",
// ];

// export default function AddTransactionDialog() {
//   const supabase = createClient();

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [type, setType] = useState("expense");
//   const [category, setCategory] = useState("");
//   const [note, setNote] = useState("");

//   const [transactionDate, setTransactionDate] = useState(new Date());

//   const [categoryOpen, setCategoryOpen] = useState(false);
//   const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
//   const [searchValue, setSearchValue] = useState("");

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("customCategories") || "[]");
//     setCategories([...DEFAULT_CATEGORIES, ...saved]);
//   }, []);

//   const addCustomCategory = () => {
//     const value = searchValue.trim();

//     if (!value) return;

//     if (
//       categories.some(
//         (c) => c.toLowerCase() === value.toLowerCase()
//       )
//     ) {
//       setCategory(value);
//       setCategoryOpen(false);
//       return;
//     }

//     const updated = [...categories, value];
//     setCategories(updated);

//     const customOnly = updated.filter(
//       (item) => !DEFAULT_CATEGORIES.includes(item)
//     );

//     localStorage.setItem(
//       "customCategories",
//       JSON.stringify(customOnly)
//     );

//     setCategory(value);
//     setCategoryOpen(false);
//   };

//   // Clears out user custom categories from storage and resets state
//   const resetToDefaultCategories = () => {
//     localStorage.removeItem("customCategories");
//     setCategories(DEFAULT_CATEGORIES);
//     setCategory("");
//     setSearchValue("");
//     setCategoryOpen(false);
//   };

//   const resetForm = () => {
//     setTitle("");
//     setAmount("");
//     setType("expense");
//     setCategory("");
//     setNote("");
//     setTransactionDate(new Date());
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       alert("Please login first");
//       setLoading(false);
//       return;
//     }

//     const { error } = await supabase.from("transaction").insert({
//       user_id: user.id,
//       title,
//       amount: Number(amount),
//       type,
//       category,
//       note,
//       transaction_date: transactionDate.toISOString(),
//     });

//     setLoading(false);

//     if (error) {
//       console.error(error);
//       alert(error.message);
//       return;
//     }

//     resetForm();
//     setOpen(false);

//     alert("Transaction added successfully");
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogTrigger asChild>
//         <Button>Add Transaction</Button>
//       </AlertDialogTrigger>

//       <AlertDialogContent
//         className="max-w-lg"
//         onPointerDownOutside={(e) => e.preventDefault()}
//       >
//         <AlertDialogHeader>
//           <AlertDialogTitle>Add Transaction</AlertDialogTitle>
//         </AlertDialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label>Title</Label>
//             <Input
//               placeholder="Pizza, Uber, Salary..."
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label>Amount</Label>
//             <Input
//               type="number"
//               placeholder="500"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label>Type</Label>
//             <Select value={type} onValueChange={setType}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="expense">Expense</SelectItem>
//                 <SelectItem value="income">Income</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Category</Label>
//             <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   className="w-full justify-between"
//                 >
//                   {category || "Select category"}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>

//               <PopoverContent className="w-full p-0" align="start">
//                 <Command>
//                   <CommandInput
//                     placeholder="Search or create category..."
//                     value={searchValue}
//                     onValueChange={setSearchValue}
//                   />

//                   <CommandEmpty>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       className="w-full justify-start"
//                       onClick={addCustomCategory}
//                     >
//                       Create "{searchValue}"
//                     </Button>
//                   </CommandEmpty>

//                   <CommandGroup>
//                     {categories.map((item) => (
//                       <CommandItem
//                         key={item}
//                         value={item}
//                         onSelect={(current) => {
//                           setCategory(current);
//                           setCategoryOpen(false);
//                         }}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             category === item ? "opacity-100" : "opacity-0"
//                           )}
//                         />
//                         {item}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>

//                   {/* RESET ACTION SECTION */}
//                   <CommandSeparator />
//                   <CommandGroup>
//                     <CommandItem
//                       onSelect={resetToDefaultCategories}
//                       className="text-destructive focus:text-destructive cursor-pointer justify-center font-medium gap-2"
//                     >
//                       <RotateCcw className="h-3.5 w-3.5" />
//                       Reset to Default Categories
//                     </CommandItem>
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>

//           <div>
//             <Label>Date</Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={cn(
//                     "w-full justify-start text-left font-normal"
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {transactionDate ? format(transactionDate, "PPP") : "Pick a date"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={transactionDate}
//                   onSelect={(date) => date && setTransactionDate(date)}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           <div>
//             <Label>Note</Label>
//             <Textarea
//               placeholder="Optional note..."
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//             />
//           </div>

//           <AlertDialogFooter>
//             <AlertDialogCancel type="button" onClick={() => setOpen(false)}>
//               Cancel
//             </AlertDialogCancel>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Saving..." : "Save Transaction"}
//             </Button>
//           </AlertDialogFooter>
//         </form>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }


// components/AddTransactionDialog.jsx
"use client";

import { useEffect, useState, useTransition } from "react"; // 💡 Added useTransition
import { useRouter } from "next/navigation";                // 💡 Added useRouter
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, RotateCcw, Loader2 } from "lucide-react"; // Added Loader2

import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Salary",
  "Investment",
  "Other",
];

export default function AddTransactionDialog({ transaction, open: controlledOpen, onOpenChange, trigger }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // 💡 High-performance UI transition tracking

  const isEditing = !!transaction;
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date());

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title || "");
      setAmount(transaction.amount?.toString() || "");
      setType(transaction.type || "expense");
      setCategory(transaction.category || "");
      setNote(transaction.note || "");
      setTransactionDate(transaction.transaction_date ? new Date(transaction.transaction_date) : new Date());
    } else {
      resetForm();
    }
  }, [transaction, open]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customCategories") || "[]");
    setCategories([...DEFAULT_CATEGORIES, ...saved]);
  }, []);

  const addCustomCategory = () => {
    const value = searchValue.trim();
    if (!value) return;

    if (categories.some((c) => c.toLowerCase() === value.toLowerCase())) {
      setCategory(value);
      setCategoryOpen(false);
      return;
    }

    const updated = [...categories, value];
    setCategories(updated);
    const customOnly = updated.filter((item) => !DEFAULT_CATEGORIES.includes(item));
    localStorage.setItem("customCategories", JSON.stringify(customOnly));

    setCategory(value);
    setCategoryOpen(false);
  };

  const resetToDefaultCategories = () => {
    localStorage.removeItem("customCategories");
    setCategories(DEFAULT_CATEGORIES);
    setCategory("");
    setSearchValue("");
    setCategoryOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setNote("");
    setTransactionDate(new Date());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user.id,
      title,
      amount: Number(amount),
      type,
      category,
      note,
      transaction_date: transactionDate.toISOString(),
    };

    let error;
    if (isEditing) {
      const res = await supabase.from("transaction").update(payload).eq("id", transaction.id);
      error = res.error;
    } else {
      const res = await supabase.from("transaction").insert(payload);
      error = res.error;
    }

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    if (!isEditing) resetForm();
    setOpen(false); // Close dialog overlay immediately
    
    // 💡 Background re-validation (No layout disruption or hard refresh flashes)
    startTransition(() => {
      router.refresh();
    });
  };

  const isWorking = loading || isPending;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? trigger : (
        <AlertDialogTrigger asChild>
          <Button>Add Transaction</Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Pizza, Uber, Salary..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isWorking}
            />
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isWorking}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={setType} disabled={isWorking}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between" disabled={isWorking}>
                  {category || "Select category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search or create category..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>
                    <Button type="button" variant="ghost" className="w-full justify-start" onClick={addCustomCategory}>
                      Create "{searchValue}"
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {categories.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={(current) => {
                          setCategory(current);
                          setCategoryOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", category === item ? "opacity-100" : "opacity-0")} />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={resetToDefaultCategories} className="text-destructive focus:text-destructive cursor-pointer justify-center font-medium gap-2">
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset to Default Categories
                    </CommandItem>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isWorking}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {transactionDate ? format(transactionDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={transactionDate}
                  onSelect={(date) => date && setTransactionDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Note</Label>
            <Textarea 
              placeholder="Optional note..." 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              disabled={isWorking}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => setOpen(false)} disabled={isWorking}>
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={isWorking}>
              {isWorking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isWorking ? "Syncing..." : isEditing ? "Update Transaction" : "Save Transaction"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}