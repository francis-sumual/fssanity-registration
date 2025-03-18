"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  User,
  LayoutDashboard,
  Settings,
  Users,
  FolderClosed,
  BarChart,
  Calendar,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import { logout } from "@/lib/actions";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                </div>
                <nav className="grid gap-1 p-4">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      isActive("/dashboard") && pathname === "/dashboard"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span>Dashboard</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={logout} className="w-full">
                  <button type="submit" className="w-full text-left">
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
