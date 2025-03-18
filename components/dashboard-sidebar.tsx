"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  User,
  Users,
  FolderClosed,
  BarChart,
  Calendar,
  UserPlus,
  ClipboardList,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex flex-col gap-2 p-4">
        <div className="py-2">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <nav className="grid gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard") && pathname === "/dashboard"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/groups"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/groups")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FolderClosed className="h-4 w-4" />
            <span>Groups</span>
          </Link>
          <Link
            href="/dashboard/members"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/members")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Members</span>
          </Link>
          <Link
            href="/dashboard/gatherings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/gatherings")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Gatherings</span>
          </Link>
          <Link
            href="/dashboard/registrations"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/registrations")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Registrations</span>
          </Link>
          <Link
            href="/dashboard/users"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/users")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Users</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/profile")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/analytics")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              isActive("/dashboard/settings")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
