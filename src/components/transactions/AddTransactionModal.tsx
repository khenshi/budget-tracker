"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { createTransaction } from "@/app/actions/transactions";
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from "@/lib/hooks/use-categories";

function formatDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function AddTransactionModal({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const categories = useCategories();
  const today = defaultDate ? formatDateInput(defaultDate) : formatDateInput(new Date());

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");

  function reset() {
    setAmount("");
    setType("expense");
    setCategoryId("");
    setDate(formatDateInput(new Date()));
    setNote("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("date", date);
    startTransition(async () => {
      const res = await createTransaction(formData);
      if (res.success) {
        toast({ title: "Transaction added", variant: "success" });
        handleOpenChange(false);
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  const options = categories;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₱)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isPending}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label>Type</Label>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${type === "expense" ? "text-muted-foreground" : "font-medium"}`}
              >
                Expense
              </span>
              <Switch
                checked={type === "income"}
                onCheckedChange={(c) => {
                  setType(c ? "income" : "expense");
                  setCategoryId("");
                }}
                disabled={isPending}
              />
              <span
                className={`text-sm ${type === "income" ? "font-medium" : "text-muted-foreground"}`}
              >
                Income
              </span>
            </div>
          </div>
          <input type="hidden" name="type" value={type} />
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              name="categoryId"
              value={categoryId}
              onValueChange={setCategoryId}
              required
              disabled={isPending}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {options.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
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
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              name="note"
              type="text"
              placeholder="e.g. Lunch with friends"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding…" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
