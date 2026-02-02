import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMonthStart, getMonthEnd } from "@/lib/utils";
import { BudgetList } from "./BudgetList";
import { AddTransactionFAB } from "@/components/transactions/AddTransactionFAB";

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const monthStart = getMonthStart(now);
  const monthEnd = getMonthEnd(now);

  const [budgets, transactions] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: session.user.id, month: monthStart },
      include: { category: true },
    }),
    prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: "expense",
        date: { gte: monthStart, lte: monthEnd },
      },
      include: { category: true },
    }),
  ]);

  const spentByCategory = new Map<string, number>();
  for (const t of transactions) {
    spentByCategory.set(
      t.categoryId,
      (spentByCategory.get(t.categoryId) ?? 0) + Number(t.amount)
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold md:text-2xl">Budgets</h1>
      <p className="text-sm text-muted-foreground">
        Monthly limits per category. 70% = warning, 100% = over budget.
      </p>
      <BudgetList
        budgets={budgets}
        spentByCategory={spentByCategory}
        monthStart={monthStart}
      />
      <AddTransactionFAB />
    </div>
  );
}
