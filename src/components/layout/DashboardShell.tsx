"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/budgets": "Budgets",
  "/categories": "Categories",
  "/settings": "Settings",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Budget Tracker";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-56 flex flex-col min-h-screen">
        <MobileHeader title={title} />
        <main className="flex-1 p-4 pb-24 md:pb-6 md:pt-6 md:px-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
