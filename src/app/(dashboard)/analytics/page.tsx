import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMonthStart, getMonthEnd } from "@/lib/utils";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { ExportCSV } from "./ExportCSV";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const thisMonthStart = getMonthStart(now);
  const thisMonthEnd = getMonthEnd(now);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [thisMonthTx, lastMonthTx] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: thisMonthStart, lte: thisMonthEnd },
      },
      include: { category: true },
    }),
    prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      include: { category: true },
    }),
  ]);

  const thisIncome = thisMonthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const thisExpense = thisMonthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const lastIncome = lastMonthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const lastExpense = lastMonthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const categoryBreakdown = new Map<string, { name: string; color: string; spent: number }>();
  for (const t of thisMonthTx.filter((x) => x.type === "expense")) {
    const cur = categoryBreakdown.get(t.categoryId) ?? {
      name: t.category.name,
      color: t.category.color,
      spent: 0,
    };
    cur.spent += Number(t.amount);
    categoryBreakdown.set(t.categoryId, cur);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold md:text-2xl">Analytics</h1>
        <ExportCSV transactions={thisMonthTx} />
      </div>
      <AnalyticsCharts
        thisIncome={thisIncome}
        thisExpense={thisExpense}
        lastIncome={lastIncome}
        lastExpense={lastExpense}
        categoryBreakdown={Array.from(categoryBreakdown.values())}
      />
    </div>
  );
}
