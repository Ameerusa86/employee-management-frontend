"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  employeeID: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  accountStatus: string;
}

export default function EditEmployeeModal({
  employee,
  onUpdate,
}: {
  employee: Employee;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState<Employee>({ ...employee });
  const [isOpen, setIsOpen] = useState(false); // Track modal state
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      if (formData.accountStatus !== employee.accountStatus) {
        // Update account status
        await axios.patch(
          `http://localhost:5000/api/employees/${employee.employeeID}/status`,
          formData.accountStatus,
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Update other fields
        await axios.put(
          `http://localhost:5000/api/employees/${employee.employeeID}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
      }

      onUpdate(); // Trigger a refresh in the parent component
      setIsOpen(false); // Close modal after successful update
      toast({
        title: "Employee Updated",
        description: `${formData.firstName} ${formData.lastName} has been successfully updated.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <Input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            placeholder="Job Title"
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
          />
          {/* Dropdown for Account Status */}
          <select
            value={formData.accountStatus}
            onChange={(e) =>
              setFormData({ ...formData, accountStatus: e.target.value })
            }
            className="w-full border rounded p-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
