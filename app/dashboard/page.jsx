

// // app/(protected)/dashboard/page.jsx
// import { createClient } from "@/utils/supabase/server";
// import AddTransactionDialog from "@/components/AddTransactionDialog";
// import DashboardFilters from "@/components/dashboard-filters";
// import StatsCards from "@/components/stats-cards";
// import FinancialCharts from "@/components/financial-charts";
// import TransactionTable from "@/components/transaction-table";

// export default async function DashboardPage({ searchParams }) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();

//   // Parse parameters from the URL safely
//   const resolvedParams = await searchParams;
//   const range = resolvedParams?.range || "7days";
//   const fromParam = resolvedParams?.from;
//   const toParam = resolvedParams?.to;

//   // Build the dynamic base query targeting the authenticated user
//   let query = supabase
//     .from("transaction")
//     .select("*")
//     .eq("user_id", user?.id)
//     .order("transaction_date", { ascending: false });

//   // Apply conditional date range filtering flags
//   if (range === "custom" && fromParam && toParam) {
//     const startDate = new Date(fromParam);
//     startDate.setHours(0, 0, 0, 0);
    
//     const endDate = new Date(toParam);
//     endDate.setHours(23, 59, 59, 999);

//     query = query
//       .gte("transaction_date", startDate.toISOString())
//       .lte("transaction_date", endDate.toISOString());
//   } else if (range !== "all") {
//     let dateCutoff = new Date();
//     if (range === "today") dateCutoff.setHours(0, 0, 0, 0);
//     else if (range === "30days") dateCutoff.setDate(dateCutoff.getDate() - 30);
//     else dateCutoff.setDate(dateCutoff.getDate() - 7); // Fallback default '7days'

//     query = query.gte("transaction_date", dateCutoff.toISOString());
//   }

//   const { data: transactions = [] } = await query;

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
//           <p className="text-muted-foreground">Manage and audit your transactional records.</p>
//         </div>
//         <div className="flex flex-wrap items-center gap-3">
//           <DashboardFilters currentRange={range} from={fromParam} to={toParam} />
//           <AddTransactionDialog />
//         </div>
//       </div>

//       <StatsCards transactions={transactions} />
//       <FinancialCharts transactions={transactions} />

//       <div className="border rounded-xl bg-card p-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
//         <TransactionTable transactions={transactions} />
//       </div>
//     </div>
//   );
// }


// app/(protected)/dashboard/page.jsx
// app/(protected)/dashboard/page.jsx
import { createClient } from "@/utils/supabase/server";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import SetBudgetDialog from "@/components/set-budget-dialog"; 
import BudgetTracker from "@/components/budget-tracker";     
import DashboardFilters from "@/components/dashboard-filters";
import StatsCards from "@/components/stats-cards";
import FinancialCharts from "@/components/financial-charts";
import TransactionTable from "@/components/transaction-table";
import { redirect } from "next/navigation";

export default async function DashboardPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 💡 Extract user display name from metadata with email fallback
  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  // 💡 Compute a smart, dynamic time-of-day greeting
  const currentHour = new Date().getHours();
  let timeGreeting = "Welcome back";
  if (currentHour < 12) timeGreeting = "Good morning";
  else if (currentHour < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  // Parse parameters from the URL safely
  const resolvedParams = await searchParams;
  const range = resolvedParams?.range || "7days";
  const fromParam = resolvedParams?.from;
  const toParam = resolvedParams?.to;

  // 1. Build the dynamic base query targeting the transactions
  let query = supabase
    .from("transaction")
    .select("*")
    .eq("user_id", user?.id)
    .order("transaction_date", { ascending: false });

  // Apply conditional date range filtering flags
  if (range === "custom" && fromParam && toParam) {
    const startDate = new Date(fromParam);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(toParam);
    endDate.setHours(23, 59, 59, 999);

    query = query
      .gte("transaction_date", startDate.toISOString())
      .lte("transaction_date", endDate.toISOString());
  } else if (range !== "all") {
    let dateCutoff = new Date();
    if (range === "today") dateCutoff.setHours(0, 0, 0, 0);
    else if (range === "30days") dateCutoff.setDate(dateCutoff.getDate() - 30);
    else dateCutoff.setDate(dateCutoff.getDate() - 7); // Fallback default '7days'

    query = query.gte("transaction_date", dateCutoff.toISOString());
  }

  const { data: transactions = [] } = await query;

  // 2. Fetch the current active budget parameters
  const { data: budgets = [] } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section with text controls & action triggers */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          {/* 💡 Personalized user greeting message added here */}
          <h1 className="text-3xl font-bold tracking-tight">
            {timeGreeting}, {userDisplayName}!
          </h1>
          <p className="text-muted-foreground">Manage and audit your transactional records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DashboardFilters currentRange={range} from={fromParam} to={toParam} />
          <SetBudgetDialog /> 
          <AddTransactionDialog />
        </div>
      </div>

      {/* 3. Dynamic Budget Progress Cards Deck */}
      {budgets?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Active Budgets</h2>
          <BudgetTracker budgets={budgets} transactions={transactions} />
        </div>
      )}

      {/* Analytics Panels */}
      <StatsCards transactions={transactions} />
      <FinancialCharts transactions={transactions} />

      {/* Data Management Audit Table */}
      <div className="border rounded-xl bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}