"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Transaction, Category } from "@prisma/client";
import { formatDate } from "@/lib/utils";

type TxWithCategory = Transaction & { category: Category };

export function ExportCSV({ transactions }: { transactions: TxWithCategory[] }) {
  function download() {
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const rows = transactions.map((t) => [
      formatDate(t.date),
      t.type,
      t.category.name,
      Number(t.amount).toFixed(2),
      t.note ?? "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="min-h-[44px]"
      onClick={download}
      disabled={transactions.length === 0}
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
