import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6 bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Budget Tracker
        </h1>
        <p className="text-muted-foreground max-w-md">
          Track your allowance and spending. Built for students, mobile-first.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
        {session?.user ? (
          <Button asChild size="lg" className="min-h-[48px]">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg" className="min-h-[48px]">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[48px]">
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
