"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/use-categories";
import { createBudget, updateBudget, deleteBudget } from "@/app/actions/budgets";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Budget, Category } from "@prisma/client";
import { cn } from "@/lib/utils";

type BudgetWithCategory = Budget & { category: Category };

export function BudgetList({
  budgets: initial,
  spentByCategory,
  monthStart,
}: {
  budgets: BudgetWithCategory[];
  spentByCategory: Map<string, number>;
  monthStart: Date;
}) {
  const [budgets, setBudgets] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const categories = useCategories();

  const editing = editId ? budgets.find((b) => b.id === editId) : null;

  async function handleCreate(formData: FormData) {
    startTransition(async () => {
      const res = await createBudget(formData);
      if (res.success) {
        setOpen(false);
        toast({ title: "Budget added", variant: "success" });
        window.location.reload();
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  async function handleUpdate(id: string, formData: FormData) {
    startTransition(async () => {
      const res = await updateBudget(id, formData);
      if (res.success) {
        setEditId(null);
        toast({ title: "Budget updated", variant: "success" });
        window.location.reload();
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteBudget(id);
      if (res.success) {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
        toast({ title: "Budget removed", variant: "default" });
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-4">
      <Button
        className="w-full min-h-[48px]"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add budget
      </Button>
      <ul className="space-y-4">
        {budgets.length === 0 ? (
          <li className="text-center py-8 text-muted-foreground">
            No budgets set for this month. Add one to track spending.
          </li>
        ) : (
          budgets.map((b) => {
            const spent = spentByCategory.get(b.categoryId) ?? 0;
            const limit = Number(b.amount);
            const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
            const isOver = pct >= 100;
            const isWarning = pct >= 70 && pct < 100;
            return (
              <li key={b.id}>
                <Card
                  className={cn(
                    isOver && "border-destructive/50",
                    isWarning && !isOver && "border-amber-500/50"
                  )}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="h-8 w-8 rounded-full shrink-0"
                          style={{ backgroundColor: b.category.color }}
                        />
                        <span className="font-medium truncate">
                          {b.category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px]"
                          onClick={() => setEditId(b.id)}
                          aria-label="Edit budget"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-[44px] min-w-[44px] text-destructive"
                          onClick={() => handleDelete(b.id)}
                          aria-label="Delete budget"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>
                        {formatCurrency(spent)} of {formatCurrency(limit)}
                      </span>
                      <span
                        className={cn(
                          isOver && "text-destructive font-medium",
                          isWarning && !isOver && "text-amber-600 dark:text-amber-400 font-medium"
                        )}
                      >
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      className="h-2"
                      indicatorClassName={cn(
                        isOver && "bg-destructive",
                        isWarning && !isOver && "bg-amber-500"
                      )}
                    />
                    {isOver && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        Over budget
                      </p>
                    )}
                    {isWarning && !isOver && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                        Approaching limit
                      </p>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })
        )}
      </ul>
      {open && (
        <AddBudgetDialog
          categories={categories}
          existingIds={budgets.map((b) => b.categoryId)}
          monthStart={monthStart}
          onClose={() => setOpen(false)}
          onSubmit={handleCreate}
          isPending={isPending}
        />
      )}
      {editing && (
        <EditBudgetDialog
          budget={editing}
          onClose={() => setEditId(null)}
          onSubmit={(formData) => handleUpdate(editing.id, formData)}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function AddBudgetDialog({
  categories,
  existingIds,
  monthStart,
  onClose,
  onSubmit,
  isPending,
}: {
  categories: Category[];
  existingIds: string[];
  monthStart: Date;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
  const [categoryId, setCategoryId] = useState("");
  const available = categories.filter((c) => !existingIds.includes(c.id));
  const monthStr = monthStart.toISOString().slice(0, 7) + "-01";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add budget</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!categoryId) return;
            const formData = new FormData(e.currentTarget);
            formData.set("categoryId", categoryId);
            formData.set("month", monthStr);
            onSubmit(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              required
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {available.map((c) => (
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
            <Label htmlFor="budget-amount">Amount (₱)</Label>
            <Input
              id="budget-amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              required
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !categoryId}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditBudgetDialog({
  budget,
  onClose,
  onSubmit,
  isPending,
}: {
  budget: BudgetWithCategory;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit budget</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(new FormData(e.currentTarget));
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-budget-amount">Amount (₱)</Label>
            <Input
              id="edit-budget-amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={Number(budget.amount)}
              required
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
