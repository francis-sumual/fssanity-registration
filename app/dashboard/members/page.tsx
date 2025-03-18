"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { MemberModal } from "@/components/member-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { fetchMembers, deleteMember, fetchGroups } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

// Define the Member type
interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  groupId: string;
  groupName: string;
  role: string;
  joinedAt: string;
}

// Define the Group type
interface Group {
  _id: string;
  name: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [membersData, groupsData] = await Promise.all([fetchMembers(), fetchGroups()]);
      setMembers(membersData);
      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;

    try {
      await deleteMember(selectedMember._id);
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
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
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }: any) => {
        return row.original.phone || "—";
      },
    },
    {
      accessorKey: "groupName",
      header: "Group",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "joinedAt",
      header: "Joined At",
      cell: ({ row }: any) => {
        return new Date(row.original.joinedAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const member = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(member)}>
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
        <h1 className="text-2xl font-bold">Members</h1>
        <Button
          onClick={() => {
            setSelectedMember(null);
            setIsMemberModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={members}
        searchColumn="name"
        searchPlaceholder="Search members..."
        pageSizeOptions={[5, 10, 20]}
        defaultPageSize={10}
      />

      <MemberModal
        open={isMemberModalOpen}
        onOpenChange={setIsMemberModalOpen}
        member={selectedMember}
        groups={groups}
        onSuccess={loadData}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Member"
        description="Are you sure you want to delete this member? This action cannot be undone."
      />
    </div>
  );
}
