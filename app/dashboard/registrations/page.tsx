/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Pencil, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { RegistrationModal } from "@/components/registration-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import {
  fetchRegistrations,
  deleteRegistration,
  fetchActiveGatherings,
  fetchMembers,
  fetchGroups,
} from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Define the Registration type
interface Registration {
  _id: string;
  gatheringId: string;
  gatheringTitle: string;
  memberId: string;
  memberName: string;
  groupId: string;
  groupName: string;
  status: string;
  registeredAt: string;
}

// Define the Gathering type
interface Gathering {
  _id: string;
  title: string;
  date: string;
}

// Define the Member type
interface Member {
  _id: string;
  name: string;
  groupId: string;
  groupName: string;
}

// Define the Group type
interface Group {
  _id: string;
  name: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [registrationsData, gatheringsData, membersData, groupsData] = await Promise.all([
        fetchRegistrations(),
        fetchActiveGatherings(),
        fetchMembers(),
        fetchGroups(),
      ]);
      setRegistrations(registrationsData);
      setGatherings(gatheringsData);
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

  const handleEdit = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsRegistrationModalOpen(true);
  };

  const handleDelete = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRegistration) return;

    try {
      await deleteRegistration(selectedRegistration._id);
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error("Failed to delete registration:", error);
      toast({
        title: "Error",
        description: "Failed to delete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRegistration(null);
    }
  };

  // Create a list of existing registrations for filtering
  const existingRegistrations = registrations.map((reg) => ({
    gatheringId: reg.gatheringId,
    memberId: reg.memberId,
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            <Badge variant="default">Confirmed</Badge>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-yellow-500" />
            <Badge variant="secondary">Pending</Badge>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 mr-1 text-red-500" />
            <Badge variant="destructive">Cancelled</Badge>
          </div>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      accessorKey: "memberName",
      header: "Member",
    },
    {
      accessorKey: "groupName",
      header: "Group",
    },
    {
      accessorKey: "gatheringTitle",
      header: "Gathering",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        return getStatusBadge(row.original.status);
      },
    },
    {
      accessorKey: "registeredAt",
      header: "Registered At",
      cell: ({ row }: any) => {
        return new Date(row.original.registeredAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const registration = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(registration)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(registration)}>
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
        <h1 className="text-2xl font-bold">Registrations</h1>
        <Button
          onClick={() => {
            setSelectedRegistration(null);
            setIsRegistrationModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Registration
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={registrations}
        searchColumn="memberName"
        searchPlaceholder="Search registrations..."
        pageSizeOptions={[5, 10, 20]}
        defaultPageSize={10}
      />

      <RegistrationModal
        open={isRegistrationModalOpen}
        onOpenChange={setIsRegistrationModalOpen}
        registration={selectedRegistration}
        gatherings={gatherings}
        members={members}
        groups={groups}
        existingRegistrations={existingRegistrations}
        onSuccess={loadData}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Registration"
        description="Are you sure you want to delete this registration? This action cannot be undone."
      />
    </div>
  );
}
