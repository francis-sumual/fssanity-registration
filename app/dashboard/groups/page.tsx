"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { GroupModal } from "@/components/group-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { fetchGroups, deleteGroup } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

// Define the Group type
interface Group {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    setIsLoading(true);
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleDelete = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedGroup) return;

    try {
      await deleteGroup(selectedGroup._id);
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      loadGroups();
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "memberCount",
      header: "Members",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: any) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const group = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(group)}>
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
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button
          onClick={() => {
            setSelectedGroup(null);
            setIsGroupModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <DataTable columns={columns} data={groups} searchColumn="name" searchPlaceholder="Search groups..." />

      <GroupModal
        open={isGroupModalOpen}
        onOpenChange={setIsGroupModalOpen}
        group={selectedGroup}
        onSuccess={loadGroups}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Group"
        description="Are you sure you want to delete this group? This action cannot be undone and will remove the group from all members."
      />
    </div>
  );
}
