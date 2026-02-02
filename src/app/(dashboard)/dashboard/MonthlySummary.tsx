import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export function MonthlySummary({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-4 flex items-center gap-3">
          <div className="rounded-full bg-green-500/10 p-2">
            <ArrowDownCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(income)}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 flex items-center gap-3">
          <div className="rounded-full bg-red-500/10 p-2">
            <ArrowUpCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expense</p>
            <p className="font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(expense)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
