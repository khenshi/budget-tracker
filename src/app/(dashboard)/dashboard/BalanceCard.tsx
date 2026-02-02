import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard({ balance }: { balance: number }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground">Current balance</p>
        <p
          className={`text-2xl font-bold sm:text-3xl ${
            balance >= 0 ? "text-primary" : "text-destructive"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </CardContent>
    </Card>
  );
}
