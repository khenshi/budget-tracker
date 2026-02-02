import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsSignOut } from "./SettingsSignOut";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold md:text-2xl">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Signed in as {session.user.email}
          </p>
        </CardHeader>
        <CardContent>
          <SettingsSignOut />
        </CardContent>
      </Card>
    </div>
  );
}

