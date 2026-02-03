"use client";

import React from "react";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@prisma/client";
import type { Category } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asComponent = (x: unknown): React.ComponentType<any> => x as React.ComponentType<any>;
const PieChart = dynamic(
  () => import("recharts").then((m) => asComponent(m.PieChart)),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((m) => asComponent(m.Pie)),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((m) => asComponent(m.Cell)),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => asComponent(m.ResponsiveContainer)),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((m) => asComponent(m.Legend)),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => asComponent(m.Tooltip)),
  { ssr: false }
);

type TxWithCategory = Transaction & { category: Category };

export function DonutChartSection({
  transactions,
}: {
  transactions: TxWithCategory[];
}) {
  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    for (const t of transactions.filter((x) => x.type === "expense")) {
      const key = t.categoryId;
      const cur = map.get(key) ?? {
        name: t.category.name,
        value: 0,
        color: t.category.color,
      };
      cur.value += Number(t.amount);
      map.set(key, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (expenseByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spending by category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">
            No spending this month yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spending by category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                label={({ name, percent }: { name: string; percent: number }) =>
                  percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                }
              >
                {expenseByCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
