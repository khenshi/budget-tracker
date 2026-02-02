"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { createCategory } from "@/app/actions/categories";
import type { Category } from "@prisma/client";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#64748b",
];

export function CategoryList({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function handleCreate(formData: FormData) {
    startTransition(async () => {
      const res = await createCategory(formData);
      if (res.success) {
        setOpen(false);
        toast({ title: "Category added", variant: "success" });
        window.location.reload();
      } else {
        toast({ title: res.error ?? "Error", variant: "destructive" });
      }
    });
  }

  const defaults = categories.filter((c) => c.isDefault);
  const custom = categories.filter((c) => !c.isDefault);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          Default categories
        </h2>
        <ul className="space-y-2">
          {defaults.map((c) => (
            <li key={c.id}>
              <Card>
                <CardContent className="py-3 flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="font-medium">{c.name}</span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Custom categories
          </h2>
          <Button
            size="sm"
            className="min-h-[44px]"
            onClick={() => setOpen(true)}
            disabled={isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        {custom.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No custom categories yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {custom.map((c) => (
              <li key={c.id}>
                <Card>
                  <CardContent className="py-3 flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="font-medium">{c.name}</span>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      {open && (
        <AddCategoryDialog
          onClose={() => setOpen(false)}
          onSubmit={handleCreate}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function AddCategoryDialog({
  onClose,
  onSubmit,
  isPending,
}: {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}) {
  const [color, setColor] = useState(PRESET_COLORS[0]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.set("color", color);
            onSubmit(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              name="name"
              type="text"
              placeholder="e.g. Subscriptions"
              maxLength={50}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-8 w-8 rounded-full border-2 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "var(--foreground)" : "transparent",
                  }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
