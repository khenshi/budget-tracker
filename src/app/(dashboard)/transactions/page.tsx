import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionList } from "./TransactionList";
import { AddTransactionFAB } from "@/components/transactions/AddTransactionFAB";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold md:text-2xl">Transactions</h1>
      <TransactionList transactions={transactions} />
      <AddTransactionFAB />
    </div>
  );
}
