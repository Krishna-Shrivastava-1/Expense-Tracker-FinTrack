// components/stats-cards.jsx
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ transactions }) {
  const totals = transactions?.reduce(
    (acc, item) => {
      if (item.type === "income") acc.income += item.amount;
      else acc.expense += item.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals?.income - totals?.expense;

  const cards = [
    {
      title: "Total Income",
      value: `₹${totals?.income.toLocaleString()}`,
      icon: ArrowUpRight,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Total Expenses",
      value: `₹${totals?.expense.toLocaleString()}`,
      icon: ArrowDownRight,
      color: "text-destructive bg-destructive/10",
    },
    {
      title: "Net Balance",
      value: `${balance >= 0 ? "" : "-"}₹${Math.abs(balance).toLocaleString()}`,
      icon: Wallet,
      color: balance >= 0 ? "text-blue-500 bg-blue-500/10" : "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards?.map((card, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}