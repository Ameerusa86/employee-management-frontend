"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { use, useEffect, useState } from "react";

interface DeleteConfirmationModalProps {
  employeeId: number;
  employeeName: string;
  onDelete: () => void;
}

export default function DeleteConfirmationModal({
  employeeId,
  employeeName,
  onDelete,
}: DeleteConfirmationModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
      onDelete(); // Trigger refresh in the parent component
      toast({
        title: `${employeeName} has been Deleted`,
        description: `Employee has been deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{employeeName}</strong>? This
          action cannot be undone.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
