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
import { createGroup, updateGroup } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

interface GroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    _id: string;
    name: string;
    description: string;
  } | null;
  onSuccess: () => void;
}

export function GroupModal({ open, onOpenChange, group, onSuccess }: GroupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [group, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (group) {
        await updateGroup(group._id, formData);
        toast({
          title: "Success",
          description: "Group updated successfully",
        });
      } else {
        await createGroup(formData);
        toast({
          title: "Success",
          description: "Group created successfully",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save group:", error);
      toast({
        title: "Error",
        description: "Failed to save group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{group ? "Edit Group" : "Create Group"}</DialogTitle>
            <DialogDescription>
              {group ? "Update the group details below." : "Fill in the details to create a new group."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter group name"
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
                placeholder="Enter group description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : group ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
