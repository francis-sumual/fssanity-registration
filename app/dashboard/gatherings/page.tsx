"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { GatheringModal } from "@/components/gathering-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { fetchGatherings, deleteGathering } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Define the Gathering type
interface Gathering {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export default function GatheringsPage() {
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [isGatheringModalOpen, setIsGatheringModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGathering, setSelectedGathering] = useState<Gathering | null>(null);

  useEffect(() => {
    loadGatherings();
  }, []);

  async function loadGatherings() {
    setIsLoading(true);
    try {
      const data = await fetchGatherings();
      setGatherings(data);
    } catch (error) {
      console.error("Failed to fetch gatherings:", error);
      toast({
        title: "Error",
        description: "Failed to load gatherings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (gathering: Gathering) => {
    setSelectedGathering(gathering);
    setIsGatheringModalOpen(true);
  };

  const handleDelete = (gathering: Gathering) => {
    setSelectedGathering(gathering);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedGathering) return;

    try {
      await deleteGathering(selectedGathering._id);
      toast({
        title: "Success",
        description: "Gathering deleted successfully",
      });
      loadGatherings();
    } catch (error) {
      console.error("Failed to delete gathering:", error);
      toast({
        title: "Error",
        description: "Failed to delete gathering. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedGathering(null);
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => {
        const description = row.original.description;
        return description.length > 50 ? `${description.substring(0, 50)}...` : description;
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        return new Date(row.original.date).toLocaleDateString();
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => {
        const isActive = row.original.isActive;
        return <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const gathering = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(gathering)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(gathering)}>
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
        <h1 className="text-2xl font-bold">Gatherings</h1>
        <Button
          onClick={() => {
            setSelectedGathering(null);
            setIsGatheringModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Gathering
        </Button>
      </div>

      <DataTable columns={columns} data={gatherings} searchColumn="title" searchPlaceholder="Search gatherings..." />

      <GatheringModal
        open={isGatheringModalOpen}
        onOpenChange={setIsGatheringModalOpen}
        gathering={selectedGathering}
        onSuccess={loadGatherings}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Gathering"
        description="Are you sure you want to delete this gathering? This action cannot be undone."
      />
    </div>
  );
}
