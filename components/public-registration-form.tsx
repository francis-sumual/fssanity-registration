/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRegistration } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Calendar, Users, User, MapPin, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface PublicRegistrationFormProps {
  gatherings: {
    _id: string;
    title: string;
    date: string;
    location: string;
    description: string;
  }[];
  groups: {
    _id: string;
    name: string;
  }[];
  members: {
    _id: string;
    name: string;
    groupId: string;
    groupName: string;
  }[];
  existingRegistrations: {
    gatheringId: string;
    memberId: string;
  }[];
}

export function PublicRegistrationForm({
  gatherings,
  groups,
  members,
  existingRegistrations,
}: PublicRegistrationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gatheringId: "",
    groupId: "",
    memberId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<typeof members>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Set default gathering if available
  useEffect(() => {
    if (gatherings.length > 0 && !formData.gatheringId) {
      setFormData((prev) => ({ ...prev, gatheringId: gatherings[0]._id }));
    }
  }, [gatherings, formData.gatheringId]);

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
  }, [formData.groupId, formData.gatheringId, members, existingRegistrations]);

  // Auto-refresh the page after successful registration
  useEffect(() => {
    if (success) {
      // Show success message for 2 seconds before refreshing
      const timer = setTimeout(() => {
        // Use router.refresh() first to update React Server Components
        router.refresh();

        // Then use a direct page reload as a fallback
        setTimeout(() => {
          window.location.href = window.location.pathname;
        }, 500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSelectChange = (name: string, value: string) => {
    // Reset success and error states when form changes
    setSuccess(false);
    setError("");

    // If changing gathering or group, reset member selection
    if (name === "gatheringId" || name === "groupId") {
      setFormData((prev) => ({ ...prev, [name]: value, memberId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError("");

    try {
      if (!formData.memberId) {
        throw new Error("Please select a member");
      }

      await createRegistration({
        gatheringId: formData.gatheringId,
        memberId: formData.memberId,
        status: "confirmed", // Default status for public registrations
      });

      setSuccess(true);
      // Reset form
      setFormData((prev) => ({
        ...prev,
        groupId: "",
        memberId: "",
      }));
    } catch (error: any) {
      console.error("Failed to save registration:", error);
      setError(error.message || "Failed to save registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected gathering details
  const selectedGathering = gatherings.find((g) => g._id === formData.gatheringId);
  const selectedMember = members.find((m) => m._id === formData.memberId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pendaftaran Tugas</CardTitle>
        <CardDescription>Pilih Misa dan Kelompok</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <div>
                <AlertTitle>Pendaftaran Berhasil!</AlertTitle>
                <AlertDescription>
                  {selectedMember?.name} Anda telah terdaftar untuk tugas Misa {selectedGathering?.title}.
                  <div className="mt-1 flex items-center text-sm">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Refreshing page...
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gatheringId" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Misa
            </Label>
            <Select
              value={formData.gatheringId}
              onValueChange={(value) => handleSelectChange("gatheringId", value)}
              disabled={isLoading || success}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a gathering" />
              </SelectTrigger>
              <SelectContent>
                {gatherings.map((gathering) => (
                  <SelectItem key={gathering._id} value={gathering._id}>
                    {gathering.title}
                    <span>
                      {new Intl.DateTimeFormat("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }).format(new Date(gathering.date))}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedGathering && (
              <div className="mt-2 text-sm text-muted-foreground">
                <div className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Intl.DateTimeFormat("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(new Date(selectedGathering.date))}
                </div>
                {selectedGathering.location && (
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedGathering.location}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupId" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Kelompok
            </Label>
            <Select
              value={formData.groupId}
              onValueChange={(value) => handleSelectChange("groupId", value)}
              disabled={isLoading || success}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelompok anda" />
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

          <div className="space-y-2">
            <Label htmlFor="memberId" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Nama Anda
            </Label>
            <Select
              value={formData.memberId}
              onValueChange={(value) => handleSelectChange("memberId", value)}
              disabled={!formData.groupId || isLoading || success}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !formData.groupId
                      ? "Pilh kelompok terlebih dahulu"
                      : filteredMembers.length === 0
                      ? "No available members"
                      : "Pilih Nama Anda"
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
            {formData.groupId && filteredMembers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                All members from this group are already registered for this gathering.
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || success || !formData.memberId || !formData.gatheringId}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Mendaftarkan anda...
            </>
          ) : success ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
