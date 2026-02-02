"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MobileHeaderProps {
  title: string;
  onMenuClick?: () => void;
  className?: string;
}

export function MobileHeader({ title, onMenuClick, className }: MobileHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 safe-area-pt md:hidden",
        className
      )}
    >
      {onMenuClick ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="min-h-[44px] min-w-[44px]"
        >
          <Menu className="h-5 w-5" />
        </Button>
      ) : (
        <div className="min-h-[44px] min-w-[44px]" />
      )}
      <h1 className="text-lg font-semibold truncate flex-1 text-center mx-2">
        {title}
      </h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="min-h-[44px] min-w-[44px]"
      >
        {mounted ? (
          theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </header>
  );
}
