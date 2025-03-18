import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <form action={logout}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Welcome</h3>
            <p className="text-sm text-muted-foreground">
              This is your personal dashboard. You can manage your account and view your data here.
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
              <Button variant="outline" size="sm">
                Account Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
