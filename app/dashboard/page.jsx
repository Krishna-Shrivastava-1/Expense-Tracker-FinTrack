// Version 2 with comparision
// import { createClient } from "@/utils/supabase/server";
// import AddTransactionDialog from "@/components/AddTransactionDialog";
// import SetBudgetDialog from "@/components/set-budget-dialog"; 
// import BudgetTracker from "@/components/budget-tracker";     
// import DashboardFilters from "@/components/dashboard-filters";
// import StatsCards from "@/components/stats-cards";
// import FinancialCharts from "@/components/financial-charts";
// import TransactionTable from "@/components/transaction-table";
// import DashboardMetricComparison from "@/components/dashboard-metric-comparison"; // 💡 Import your new comparison card
// import { redirect } from "next/navigation";

// export default async function DashboardPage({ searchParams }) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/login");
//   }

//   const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

//   // Dynamic greeting logic (Note: Since this runs on the server, see Option 1 from earlier to move this client-side if server time discrepancies persist)
//   const currentHour = new Date().getHours();
//   let timeGreeting = "Welcome back";
//   if (currentHour < 12) timeGreeting = "Good morning";
//   else if (currentHour < 17) timeGreeting = "Good afternoon";
//   else timeGreeting = "Good evening";

//   // Parse parameters from the URL safely
//   const resolvedParams = await searchParams;
//   const range = resolvedParams?.range || "7days";
//   const fromParam = resolvedParams?.from;
//   const toParam = resolvedParams?.to;

//   // --- 💡 COMPARATIVE TIMEFRAME ARCHITECTURE ---
//   let startDate, endDate;
//   let prevStartDate, prevEndDate;

//   const now = new Date();

//   if (range === "custom" && fromParam && toParam) {
//     startDate = new Date(fromParam);
//     startDate.setHours(0, 0, 0, 0);
    
//     endDate = new Date(toParam);
//     endDate.setHours(23, 59, 59, 999);

//     // Dynamic Previous Frame: Shift backwards by the exact length of the selected custom range
//     const rangeDurationMs = endDate.getTime() - startDate.getTime();
//     prevStartDate = new Date(startDate.getTime() - rangeDurationMs - 1);
//     prevEndDate = new Date(startDate.getTime() - 1);
//   } else {
//     endDate = new Date();
//     startDate = new Date();

//     if (range === "today") {
//       startDate.setHours(0, 0, 0, 0);
      
//       prevStartDate = new Date(startDate);
//       prevStartDate.setDate(prevStartDate.getDate() - 1);
//       prevEndDate = new Date(startDate);
//       prevEndDate.setMilliseconds(-1); // End of yesterday
//     } else {
//       const daysToSubtract = range === "30days" ? 30 : 7; // default fallback '7days'
//       startDate.setDate(now.getDate() - daysToSubtract);
      
//       prevStartDate = new Date(startDate);
//       prevStartDate.setDate(prevStartDate.getDate() - daysToSubtract);
//       prevEndDate = new Date(startDate);
//       prevEndDate.setMilliseconds(-1);
//     }
//   }

//   // 1. Fetch Current Period Transactions
//   let currentQuery = supabase
//     .from("transaction")
//     .select("*")
//     .eq("user_id", user?.id)
//     .order("transaction_date", { ascending: false });

//   if (range !== "all") {
//     currentQuery = currentQuery
//       .gte("transaction_date", startDate.toISOString())
//       .lte("transaction_date", endDate.toISOString());
//   }
//   const { data: transactions = [] } = await currentQuery;

//   // 2. 💡 Fetch Previous Period Transactions (Used entirely for computing trends)
//   let prevTransactions = [];
//   if (range !== "all") {
//     const { data: pastData } = await supabase
//       .from("transaction")
//       .select("amount, type")
//       .eq("user_id", user?.id)
//       .gte("transaction_date", prevStartDate.toISOString())
//       .lte("transaction_date", prevEndDate.toISOString());
//     prevTransactions = pastData || [];
//   }

//   // 3. Compute Aggregates for comparison
//   const currentTotalSpend = transactions
//     .filter(t => t.type === "expense")
//     .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

//   const prevTotalSpend = prevTransactions
//     .filter(t => t.type === "expense")
//     .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

//   // 4. Fetch Active Budget Limits
//   const { data: budgets = [] } = await supabase
//     .from("budgets")
//     .select("*")
//     .eq("user_id", user?.id)
//     .order("created_at", { ascending: false });

//   // Map user-friendly labels to the trend card header string
//   const rangeLabels = { today: "Today's Spending", "7days": "Weekly Spending Trend", "30days": "Monthly Spending Trend", custom: "Custom Period Trend" };
//   const trendCardTitle = rangeLabels[range] || "Spending Trend";

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       {/* Header section */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             {timeGreeting}, {userDisplayName}!
//           </h1>
//           <p className="text-muted-foreground">Manage and audit your transactional records.</p>
//         </div>
//         <div className="flex flex-wrap justify-end items-center gap-3">
//           <DashboardFilters currentRange={range} from={fromParam} to={toParam} />
//           <SetBudgetDialog /> 
//           <AddTransactionDialog />
//         </div>
//       </div>

//       {/* 💡 Trend Analytics Grid Row */}
//       {range !== "all" && (
//         <div className="grid gap-4 md:grid-cols-3">
//           <DashboardMetricComparison 
//             currentSpend={currentTotalSpend} 
//             previousSpend={prevTotalSpend} 
//             title={trendCardTitle} 
//           />
//         </div>
//       )}

//       {/* Dynamic Budget Progress Cards Deck */}
//       {budgets?.length > 0 && (
//         <div className="space-y-3">
//           <h2 className="text-xl font-semibold tracking-tight">Active Budgets</h2>
//           <BudgetTracker budgets={budgets} transactions={transactions} />
//         </div>
//       )}

//       {/* Analytics Panels */}
//       <StatsCards transactions={transactions} />
//       <FinancialCharts transactions={transactions} />

//       {/* Data Management Audit Table */}
//       <div className="border rounded-xl bg-card p-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
//         <TransactionTable transactions={transactions} />
//       </div>
//     </div>
//   );
// }

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
        <div className="flex flex-wrap justify-end items-center gap-3">
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