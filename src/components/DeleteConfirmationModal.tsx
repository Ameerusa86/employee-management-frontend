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
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
      onDelete(); // Trigger refresh in the parent component
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <Dialog>
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
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
