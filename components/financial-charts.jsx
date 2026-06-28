// // components/financial-charts.jsx
// "use client";

// import { format, parseISO } from "date-fns";
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// // A vibrant, highly distinct, premium design palette (Hex codes)
// const DISTINCT_COLORS = [
//   "#4F46E5", // Indigo
//   "#10B981", // Emerald Green
//   "#F59E0B", // Amber Gold
//   "#EF4444", // Crimson Red
//   "#06B6D4", // Cyan Blue
//   "#8B5CF6", // Purple
//   "#EC4899", // Pink
// ];

// export default function FinancialCharts({ transactions }) {
//   if (!transactions || transactions.length === 0) {
//     return (
//       <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
//         No analytical data available.
//       </div>
//     );
//   }
//   // 1. Timeline Data Setup (Unchanged)
//   const timelineMap = transactions?.reduce((acc, t) => {
//     const dateStr = format(parseISO(t.transaction_date), "MMM dd");
//     if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
//     if (t.type === "income") acc[dateStr].income += t.amount;
//     else acc[dateStr].expense += t.amount;
//     return acc;
//   }, {});
//   const timelineData = Object?.values(timelineMap).reverse();

//   // 2. Category Pie Data Setup
//   const categoryMap = transactions.reduce((acc, t) => {
//     if (t.type === "expense") {
//       acc[t.category] = (acc[t.category] || 0) + t.amount;
//     }
//     return acc;
//   }, {});
  
//   // Cleanly attach concrete color values directly to each data slice
//   const categoryData = Object.entries(categoryMap).map(([name, value], index) => ({
//     name,
//     value,
//     color: DISTINCT_COLORS[index % DISTINCT_COLORS.length]
//   }));

//   const timelineConfig = {
//     income: { label: "Income" },
//     expense: { label: "Expense" },
//   };

//   // Build local config mapping for labels
//   const categoryConfig = categoryData.reduce((acc, current) => {
//     acc[current.name] = { label: current.name };
//     return acc;
//   }, {});

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       {/* Cash Flow Area Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Cash Flow History</CardTitle>
//           <CardDescription>Income vs Expenses trajectory</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={timelineConfig} className="h-[300px] w-full">
//             <AreaChart data={timelineData} margin={{ left: -20, right: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis dataKey="date" tickLine={false} axisLine={false} />
//               <YAxis tickLine={false} axisLine={false} />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Area type="monotone" dataKey="income" stroke="#10B981" fill="rgba(16, 185, 129, 0.05)" strokeWidth={2.5} />
//               <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={2.5} />
//             </AreaChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>

//       {/* Re-designed Expenses Pie Chart */}
//       <Card className="flex flex-col">
//         <CardHeader className="items-center pb-0">
//           <CardTitle>Expenses by Category</CardTitle>
//           <CardDescription>Distribution breakdown</CardDescription>
//         </CardHeader>
//         <CardContent className="flex-1 pb-0">
//           {categoryData.length === 0 ? (
//             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//               No expenses recorded
//             </div>
//           ) : (
//             <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[280px] w-full">
//               <PieChart>
//                 <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                 <Pie 
//                   data={categoryData} 
//                   dataKey="value" 
//                   nameKey="name" 
//                   innerRadius={60} 
//                   outerRadius={90}
//                   paddingAngle={2}
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={entry.color} 
//                       stroke="var(--background)" 
//                       strokeWidth={2} 
//                     />
//                   ))}
//                 </Pie>
//                 <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
//               </PieChart>
//             </ChartContainer>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// // components/financial-charts.jsx
// "use client";

// import { format, parseISO } from "date-fns";
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// /**
//  * Generates an array of highly distinct, premium HSL colors.
//  * Uses the Golden Ratio to step aggressively across the 360° color wheel,
//  * ensuring maximum visual separation between consecutive colors.
//  */
// function generateEvenlySpacedColors(count) {
//   const colors = [];
//   const goldenRatioConjugate = 0.618033988749895;
//   let hue = 195; // Premium starting base hue (deep cyan/blue neighborhood)

//   for (let i = 0; i < count; i++) {
//     hue = (hue + goldenRatioConjugate * 360) % 360;
//     // 90% Saturation, 46% Lightness ensures punchy, distinct, high-contrast colors
//     colors.push(`hsl(${Math.floor(hue)}, 70%, 46%)`);
//   }
//   return colors;
// }

// export default function FinancialCharts({ transactions }) {
//   if (!transactions || transactions.length === 0) {
//     return (
//       <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
//         No analytical data available.
//       </div>
//     );
//   }

//   // 1. Timeline Data Setup (Unchanged)
//   const timelineMap = transactions?.reduce((acc, t) => {
//     const dateStr = format(parseISO(t.transaction_date), "MMM dd");
//     if (!acc[dateStr]) acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
//     if (t.type === "income") acc[dateStr].income += t.amount;
//     else acc[dateStr].expense += t.amount;
//     return acc;
//   }, {});
//   const timelineData = Object?.values(timelineMap).reverse();

//   // 2. Category Pie Data Setup
//   const categoryMap = transactions.reduce((acc, t) => {
//     if (t.type === "expense") {
//       acc[t.category] = (acc[t.category] || 0) + t.amount;
//     }
//     return acc;
//   }, {});
  
//   // Extract all unique categories present in the current dataset
//   const uniqueCategories = Object.keys(categoryMap);
  
//   // Generate a customized color spectrum matching the exact count of categories
//   const dynamicColors = generateEvenlySpacedColors(uniqueCategories.length);

//   // Cleanly pair each category with its mathematically guaranteed unique color
//   const categoryData = uniqueCategories.map((name, index) => ({
//     name,
//     value: categoryMap[name],
//     color: dynamicColors[index]
//   }));

//   const timelineConfig = {
//     income: { label: "Income" },
//     expense: { label: "Expense" },
//   };

//   // Build local config mapping for labels
//   const categoryConfig = categoryData.reduce((acc, current) => {
//     acc[current.name] = { label: current.name };
//     return acc;
//   }, {});

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       {/* Cash Flow Area Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Cash Flow History</CardTitle>
//           <CardDescription>Income vs Expenses trajectory</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChartContainer config={timelineConfig} className="h-[300px] w-full">
//             <AreaChart data={timelineData} margin={{ left: -20, right: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis dataKey="date" tickLine={false} axisLine={false} />
//               <YAxis tickLine={false} axisLine={false} />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Area type="monotone" dataKey="income" stroke="#10B981" fill="rgba(16, 185, 129, 0.05)" strokeWidth={2.5} />
//               <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={2.5} />
//             </AreaChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>

//       {/* Dynamic Expenses Pie Chart */}
//       <Card className="flex flex-col">
//         <CardHeader className="items-center pb-0">
//           <CardTitle>Expenses by Category</CardTitle>
//           <CardDescription>Distribution breakdown</CardDescription>
//         </CardHeader>
//         <CardContent className="flex-1 pb-0">
//           {categoryData.length === 0 ? (
//             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//               No expenses recorded
//             </div>
//           ) : (
//             <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[280px] w-full">
//               <PieChart>
//                 <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                 <Pie 
//                   data={categoryData} 
//                   dataKey="value" 
//                   nameKey="name" 
//                   innerRadius={60} 
//                   outerRadius={90}
//                   paddingAngle={2}
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={entry.color} 
//                       stroke="var(--background)" 
//                       strokeWidth={2} 
//                     />
//                   ))}
//                 </Pie>
//                 <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
//               </PieChart>
//             </ChartContainer>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



// components/financial-charts.jsx
"use client";

import { useState, useEffect } from "react";
import { format, parseISO, startOfWeek, startOfMonth } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function generateEvenlySpacedColors(count) {
  const colors = [];
  const goldenRatioConjugate = 0.618033988749895;
  let hue = 195;

  for (let i = 0; i < count; i++) {
    hue = (hue + goldenRatioConjugate * 360) % 360;
    colors.push(`hsl(${Math.floor(hue)}, 70%, 46%)`);
  }
  return colors;
}

export default function FinancialCharts({ transactions }) {
  // Local state to manage X-Axis aggregation grouping level
  const [groupBy, setGroupBy] = useState("day");

  // Smart Effect: Adjust the grouping bucket based on the volume of total transactions coming through filters
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    
    // Check approximate span of data or raw count to choose the best default view
    if (transactions.length > 60) {
      setGroupBy("month"); // Clutter protector for huge date ranges (e.g., All Time)
    } else if (transactions.length > 20) {
      setGroupBy("week");  // Sweet spot for multi-week spans
    } else {
      setGroupBy("day");   // Perfect for short-bursts like last 7 days or today
    }
  }, [transactions]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
        No analytical data available.
      </div>
    );
  }

  // ==========================================
  // DYNAMIC TIMELINE DATA AGGREGATION
  // ==========================================
  const timelineMap = transactions.reduce((acc, t) => {
    const dateObj = parseISO(t.transaction_date);
    let groupKey = "";
    let displayLabel = "";

    // Grouping logic based on dropdown state
    if (groupBy === "month") {
      const monthStart = startOfMonth(dateObj);
      groupKey = format(monthStart, "yyyy-MM");
      displayLabel = format(monthStart, "MMM yyyy");
    } else if (groupBy === "week") {
      const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 }); // Monday start
      groupKey = format(weekStart, "yyyy-'W'II"); // Standardized ISO year-week format
      displayLabel = `w/c ${format(weekStart, "MMM dd")}`; // "Week commencing..."
    } else {
      groupKey = format(dateObj, "yyyy-MM-dd");
      displayLabel = format(dateObj, "MMM dd");
    }

    if (!acc[groupKey]) {
      acc[groupKey] = { sortKey: groupKey, date: displayLabel, income: 0, expense: 0 };
    }

    if (t.type === "income") acc[groupKey].income += t.amount;
    else acc[groupKey].expense += t.amount;
    
    return acc;
  }, {});

  // Sort chronologically (oldest to newest) so the trajectory builds left-to-right safely
  const timelineData = Object.values(timelineMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  // ==========================================
  // CATEGORY PIE DATA SETUP
  // ==========================================
  const categoryMap = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});
  
  const uniqueCategories = Object.keys(categoryMap);
  const dynamicColors = generateEvenlySpacedColors(uniqueCategories.length);

  const categoryData = uniqueCategories.map((name, index) => ({
    name,
    value: categoryMap[name],
    color: dynamicColors[index]
  }));

  const timelineConfig = {
    income: { label: "Income" },
    expense: { label: "Expense" },
  };

  const categoryConfig = categoryData.reduce((acc, current) => {
    acc[current.name] = { label: current.name };
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Cash Flow Area Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Cash Flow History</CardTitle>
            <CardDescription>Income vs Expenses trajectory</CardDescription>
          </div>
          
          {/* Dynamic Granularity Multi-Selector Selector */}
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-[110px] h-8 text-xs font-medium">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="text-xs">Daily</SelectItem>
              <SelectItem value="week" className="text-xs">Weekly</SelectItem>
              <SelectItem value="month" className="text-xs">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent>
          <ChartContainer config={timelineConfig} className="h-[300px] w-full">
            <AreaChart data={timelineData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                className="text-[11px] font-medium"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                className="text-[11px] font-medium"
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="income" stroke="#10B981" fill="rgba(16, 185, 129, 0.05)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={2.5} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Dynamic Expenses Pie Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Distribution breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {categoryData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No expenses recorded
            </div>
          ) : (
            <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[280px] w-full">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie 
                  data={categoryData} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={60} 
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="var(--background)" 
                      strokeWidth={2} 
                    />
                  ))}
                </Pie>
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" className="text-xs" />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}