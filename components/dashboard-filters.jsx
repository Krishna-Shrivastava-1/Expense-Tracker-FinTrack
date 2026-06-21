

// components/dashboard-filters.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DashboardFilters({ currentRange, from, to }) {
  const router = useRouter();
  const pathname = usePathname();

  // Maintain local date-range selection states
  const [dateRange, setDateRange] = useState({
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  // Keep state synchronized with URL query params
  useEffect(() => {
    setDateRange({
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }, [from, to]);

  const handleRangeChange = (range) => {
    if (range === "custom") return; // Handled separately by calendar selector
    router.push(`${pathname}?range=${range}`);
  };

  const handleCustomDateSelect = (range) => {
    setDateRange(range);
    
    if (range?.from && range?.to) {
      const fromStr = format(range.from, "yyyy-MM-dd");
      const toStr = format(range.to, "yyyy-MM-dd");
      router.push(`${pathname}?range=custom&from=${fromStr}&to=${toStr}`);
    }
  };

  const quickRanges = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "7days" },
    { label: "30 Days", value: "30days" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Quick Action Preset Selectors */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg border">
        {quickRanges.map((r) => (
          <Button
            key={r.value}
            variant={currentRange === r.value ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-8"
            onClick={() => handleRangeChange(r.value)}
          >
            {r.label}
          </Button>
        ))}
      </div>

      {/* Advanced Custom Date Range Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-xs justify-start text-left font-normal gap-2",
              currentRange === "custom" && "border-primary bg-primary/5 text-primary"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
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
              <span>Custom Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleCustomDateSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date()} // Disable future dates here too!
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}