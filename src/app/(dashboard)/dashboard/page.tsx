import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMonthStart, getMonthEnd } from "@/lib/utils";
import { BalanceCard } from "./BalanceCard";
import { MonthlySummary } from "./MonthlySummary";
import { DonutChartSection } from "./DonutChartSection";
import { RecentTransactions } from "./RecentTransactions";
import { AddTransactionFAB } from "@/components/transactions/AddTransactionFAB";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();
  const monthStart = getMonthStart(now);
  const monthEnd = getMonthEnd(now);

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.budget.findMany({
      where: { userId: session.user.id, month: monthStart },
      include: { category: true },
    }),
  ]);

  const monthTransactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: { gte: monthStart, lte: monthEnd },
    },
    include: { category: true },
  });

  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const balance = income - expense;

  return (
    <div className="space-y-6">
      <BalanceCard balance={balance} />
      <MonthlySummary income={income} expense={expense} />
      <DonutChartSection transactions={monthTransactions} />
      <RecentTransactions transactions={transactions} />
      <AddTransactionFAB />
    </div>
  );
}
