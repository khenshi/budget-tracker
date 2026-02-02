"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionModal } from "./AddTransactionModal";

export function AddTransactionFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="icon-lg"
        className="fixed bottom-20 right-4 z-30 md:bottom-8 md:right-6 shadow-lg rounded-full min-h-[56px] min-w-[56px]"
        onClick={() => setOpen(true)}
        aria-label="Add transaction"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <AddTransactionModal open={open} onOpenChange={setOpen} />
    </>
  );
}
