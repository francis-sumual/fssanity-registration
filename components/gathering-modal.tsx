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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createGathering, updateGathering } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

interface GatheringModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gathering: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    quota?: number;
    isActive: boolean;
  } | null;
  onSuccess: () => void;
}

export function GatheringModal({ open, onOpenChange, gathering, onSuccess }: GatheringModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    quota: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (gathering) {
      // Format the date to YYYY-MM-DD for the input field
      const formattedDate = gathering.date ? new Date(gathering.date).toISOString().split("T")[0] : "";

      setFormData({
        title: gathering.title,
        description: gathering.description,
        date: formattedDate,
        location: gathering.location,
        quota: gathering.quota?.toString() || "",
        isActive: gathering.isActive,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        quota: "",
        isActive: true,
      });
    }
  }, [gathering, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert quota to number or undefined
      const quotaValue = formData.quota ? Number.parseInt(formData.quota) : undefined;

      // Validate quota is a positive number
      if (formData.quota && (isNaN(quotaValue!) || quotaValue! <= 0)) {
        throw new Error("Quota must be a positive number");
      }

      const dataToSubmit = {
        ...formData,
        quota: quotaValue,
      };

      if (gathering) {
        await updateGathering(gathering._id, dataToSubmit);
        toast({
          title: "Success",
          description: "Gathering updated successfully",
        });
      } else {
        await createGathering(dataToSubmit);
        toast({
          title: "Success",
          description: "Gathering created successfully",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save gathering:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save gathering. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{gathering ? "Edit Gathering" : "Create Gathering"}</DialogTitle>
            <DialogDescription>
              {gathering ? "Update the gathering details below." : "Fill in the details to create a new gathering."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter gathering title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter gathering description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quota">Maximum Capacity</Label>
              <Input
                id="quota"
                name="quota"
                type="number"
                min="1"
                value={formData.quota}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of attendees allowed. Leave empty for unlimited capacity.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : gathering ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
