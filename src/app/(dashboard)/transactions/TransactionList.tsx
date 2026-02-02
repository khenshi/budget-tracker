"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTransaction, updateTransaction } from "@/app/actions/transactions";
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from "@/lib/hooks/use-categories";
import type { Transaction, Category } from "@prisma/client";
import { cn } from "@/lib/utils";

type TxWithCategory = Transaction & { category: Category };

export function TransactionList({
  transactions: initial,
}: {
  transactions: TxWithCategory[];
}) {
  const [transactions, setTransactions] = useState(initial);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const categories = useCategories();

  const editing = editId
    ? transactions.find((t) => t.id === editId)
    : null;

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteTransaction(id);
      if (res.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast({ title: "Transaction deleted", variant: "default" });
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!editId) return;
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateTransaction(editId, formData);
      if (res.success) {
        setEditId(null);
        toast({ title: "Transaction updated", variant: "success" });
        window.location.reload(); // refresh list from server
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  return (
    <>
      <ul className="space-y-2">
        {transactions.length === 0 ? (
          <li className="text-center py-12 text-muted-foreground">
            No transactions yet. Tap + to add one.
          </li>
        ) : (
          transactions.map((t) => (
            <li
              key={t.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm",
                "min-h-[44px]"
              )}
            >
              <div
                className="h-10 w-10 rounded-full shrink-0"
                style={{ backgroundColor: `${t.category.color}30` }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">
                  {t.category.name}
                  {t.note ? ` · ${t.note}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(t.date)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={
                    t.type === "income"
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : "text-red-600 dark:text-red-400 font-semibold"
                  }
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(Number(t.amount))}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px]"
                  onClick={() => setEditId(t.id)}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-[44px] min-w-[44px] text-destructive hover:text-destructive"
                  onClick={() => handleDelete(t.id)}
                  aria-label="Delete"
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      {editing && (
        <EditTransactionDialog
          transaction={editing}
          categories={categories}
          open={!!editId}
          onOpenChange={(open) => !open && setEditId(null)}
          onSubmit={handleEditSubmit}
          isPending={isPending}
        />
      )}
    </>
  );
}

function EditTransactionDialog({
  transaction,
  categories,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  transaction: TxWithCategory;
  categories: { id: string; name: string; color: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
}) {
  const defaultDate = new Date(transaction.date).toISOString().slice(0, 10);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (₱)</Label>
            <Input
              id="edit-amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={Number(transaction.amount)}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm">Expense</span>
              <input type="hidden" name="type" id="edit-type" defaultValue={transaction.type} />
              <Switch
                defaultChecked={transaction.type === "income"}
                disabled={isPending}
                onCheckedChange={(checked) => {
                  const el = document.getElementById("edit-type") as HTMLInputElement;
                  if (el) el.value = checked ? "income" : "expense";
                }}
              />
              <span className="text-sm">Income</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <input type="hidden" name="categoryId" id="edit-categoryId" defaultValue={transaction.categoryId} />
            <Select
              defaultValue={transaction.categoryId}
              disabled={isPending}
              onValueChange={(v) => {
                const el = document.getElementById("edit-categoryId") as HTMLInputElement;
                if (el) el.value = v;
              }}
            >
              <SelectTrigger id="edit-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              name="date"
              type="date"
              defaultValue={defaultDate}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-note">Note</Label>
            <Input
              id="edit-note"
              name="note"
              type="text"
              defaultValue={transaction.note ?? ""}
              maxLength={500}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
