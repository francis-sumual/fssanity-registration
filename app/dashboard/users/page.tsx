/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Pencil, Trash2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { UserModal } from "@/components/user-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { fetchUsers, deleteUser } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Define the User type
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser._id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldAlert className="h-4 w-4 mr-1 text-destructive" />;
      case "moderator":
        return <ShieldCheck className="h-4 w-4 mr-1 text-warning" />;
      default:
        return <Shield className="h-4 w-4 mr-1 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => {
        const role = row.original.role;
        return (
          <div className="flex items-center">
            {getRoleIcon(role)}
            <span className="capitalize">{role}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        return getStatusBadge(row.original.status);
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: any) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }: any) => {
        return row.original.lastLogin ? new Date(row.original.lastLogin).toLocaleDateString() : "Never";
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(user)}
              disabled={user.role === "admin"} // Prevent deleting admin users
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsUserModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchColumn="name"
        searchPlaceholder="Search users..."
        pageSizeOptions={[5, 10, 20]}
        defaultPageSize={10}
      />

      <UserModal open={isUserModalOpen} onOpenChange={setIsUserModalOpen} user={selectedUser} onSuccess={loadUsers} />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
