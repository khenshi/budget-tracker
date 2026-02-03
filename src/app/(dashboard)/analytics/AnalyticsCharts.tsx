"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Dynamic import for Recharts (avoids SSR, reduces bundle). Type assertion for Next.js dynamic compatibility.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asComponent = (x: unknown): React.ComponentType<any> => x as React.ComponentType<any>;
const BarChart = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.BarChart)),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.Bar)),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.XAxis)),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.YAxis)),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.CartesianGrid)),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.ResponsiveContainer)),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.Tooltip)),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.Legend)),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.PieChart)),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.Pie)),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((mod) => asComponent(mod.Cell)),
  { ssr: false }
);

export function AnalyticsCharts({
  thisIncome,
  thisExpense,
  lastIncome,
  lastExpense,
  categoryBreakdown,
}: {
  thisIncome: number;
  thisExpense: number;
  lastIncome: number;
  lastExpense: number;
  categoryBreakdown: { name: string; color: string; spent: number }[];
}) {
  const comparisonData = [
    { month: "Last month", income: lastIncome, expense: lastExpense },
    { month: "This month", income: thisIncome, expense: thisExpense },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly comparison</CardTitle>
          <p className="text-sm text-muted-foreground">
            Income vs expense (last month vs this month)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full touch-manipulation">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                  className="text-xs"
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category breakdown (this month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full touch-manipulation">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="spent"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }: { name: string; percent: number }) =>
                      percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                    }
                  >
                    {categoryBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {categoryBreakdown.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No spending data this month for category breakdown.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
