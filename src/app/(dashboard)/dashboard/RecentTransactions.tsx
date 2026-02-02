import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@prisma/client";
import type { Category } from "@prisma/client";
import { ArrowRight } from "lucide-react";

type TxWithCategory = Transaction & { category: Category };

export function RecentTransactions({
  transactions,
}: {
  transactions: TxWithCategory[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recent transactions</h2>
        <Link
          href="/transactions"
          className="text-sm text-primary font-medium flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="space-y-2">
        {transactions.length === 0 ? (
          <li className="text-sm text-muted-foreground py-4 text-center">
            No transactions yet.
          </li>
        ) : (
          transactions.map((t) => (
            <li key={t.id}>
              <Link
                href={`/transactions?id=${t.id}`}
                className="flex items-center justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-accent/50 min-h-[44px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 rounded-full shrink-0"
                    style={{ backgroundColor: `${t.category.color}20` }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {t.category.name}
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span
                  className={
                    t.type === "income"
                      ? "text-green-600 dark:text-green-400 font-medium"
                      : "text-red-600 dark:text-red-400 font-medium"
                  }
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(Number(t.amount))}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
