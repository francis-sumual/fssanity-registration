"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRegistration, updateRegistration } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: {
    _id: string;
    gatheringId: string;
    gatheringTitle: string;
    memberId: string;
    memberName: string;
    groupId: string;
    groupName: string;
    status: string;
    registeredAt: string;
  } | null;
  gatherings: {
    _id: string;
    title: string;
    date: string;
  }[];
  members: {
    _id: string;
    name: string;
    groupId: string;
    groupName: string;
  }[];
  groups: {
    _id: string;
    name: string;
  }[];
  existingRegistrations: {
    gatheringId: string;
    memberId: string;
  }[];
  onSuccess: () => void;
}

export function RegistrationModal({
  open,
  onOpenChange,
  registration,
  gatherings,
  members,
  groups,
  existingRegistrations,
  onSuccess,
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    gatheringId: "",
    groupId: "",
    memberId: "",
    status: "confirmed",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<typeof members>([]);

  useEffect(() => {
    if (registration) {
      setFormData({
        gatheringId: registration.gatheringId,
        groupId: registration.groupId,
        memberId: registration.memberId,
        status: registration.status,
      });
      // When editing, show only the registered member
      setFilteredMembers(members.filter((m) => m._id === registration.memberId));
    } else {
      setFormData({
        gatheringId: gatherings.length > 0 ? gatherings[0]._id : "",
        groupId: "",
        memberId: "",
        status: "confirmed",
      });
      setFilteredMembers([]);
    }
  }, [registration, gatherings, members, open]);

  // Filter members when group or gathering selection changes
  useEffect(() => {
    if (!formData.groupId || !formData.gatheringId) {
      setFilteredMembers([]);
      return;
    }

    // Get members from the selected group
    const groupMembers = members.filter((member) => member.groupId === formData.groupId);

    // Filter out members who are already registered for this gathering
    const availableMembers = groupMembers.filter((member) => {
      // If we're editing, allow the current member
      if (registration && member._id === registration.memberId) {
        return true;
      }

      // Check if this member is already registered for this gathering
      return !existingRegistrations.some(
        (reg) => reg.gatheringId === formData.gatheringId && reg.memberId === member._id
      );
    });

    setFilteredMembers(availableMembers);

    // Clear member selection if the current selection is not in the filtered list
    if (formData.memberId && !availableMembers.some((m) => m._id === formData.memberId)) {
      setFormData((prev) => ({ ...prev, memberId: "" }));
    }
  }, [formData.groupId, formData.gatheringId, members, existingRegistrations, registration]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If changing gathering or group, reset member selection
    if (name === "gatheringId" || name === "groupId") {
      setFormData((prev) => ({ ...prev, [name]: value, memberId: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (registration) {
        await updateRegistration(registration._id, {
          status: formData.status,
        });
        toast({
          title: "Success",
          description: "Registration updated successfully",
        });
      } else {
        if (!formData.memberId) {
          throw new Error("Please select a member");
        }

        await createRegistration({
          gatheringId: formData.gatheringId,
          memberId: formData.memberId,
          status: formData.status,
        });
        toast({
          title: "Success",
          description: "Registration created successfully",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save registration:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{registration ? "Edit Registration" : "Add Registration"}</DialogTitle>
            <DialogDescription>
              {registration
                ? "Update the registration details below."
                : "Fill in the details to add a new registration."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gatheringId">Gathering</Label>
              <Select
                value={formData.gatheringId}
                onValueChange={(value) => handleSelectChange("gatheringId", value)}
                disabled={!!registration} // Disable changing gathering if editing
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a gathering" />
                </SelectTrigger>
                <SelectContent>
                  {gatherings
                    .filter(
                      (gathering) =>
                        gathering.date >= new Date().toISOString() ||
                        (registration && registration.gatheringId === gathering._id)
                    )
                    .map((gathering) => (
                      <SelectItem key={gathering._id} value={gathering._id}>
                        {gathering.title} ({formatDate(gathering.date)})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {!registration && (
              <div className="grid gap-2">
                <Label htmlFor="groupId">Group</Label>
                <Select value={formData.groupId} onValueChange={(value) => handleSelectChange("groupId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group._id} value={group._id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="memberId">Member</Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => handleSelectChange("memberId", value)}
                disabled={!!registration || !formData.groupId} // Disable if editing or no group selected
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      registration
                        ? registration.memberName
                        : !formData.groupId
                        ? "Select a group first"
                        : filteredMembers.length === 0
                        ? "No available members"
                        : "Select a member"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {!formData.groupId ? "Select a group first" : "No available members"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formData.groupId && filteredMembers.length === 0 && !registration && (
                <p className="text-xs text-muted-foreground">
                  All members from this group are already registered for this gathering.
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!registration && (!formData.memberId || !formData.gatheringId))}
            >
              {isLoading ? "Saving..." : registration ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
