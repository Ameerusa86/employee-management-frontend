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

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/employees/${employee.employeeID}`,
        formData
      );
      onUpdate(); // Trigger a refresh in the parent component
      setIsOpen(false); // Close modal after successful update
    } catch (error) {
      console.error(
        "Error updating employee:",
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : (error as Error).message
      );
      alert(
        axios.isAxiosError(error) && error.response
          ? `Failed to update employee: ${error.response.data}`
          : "Failed to update employee. Please try again later."
      );
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
          {/* Cancel Button */}
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {/* Save Changes Button */}
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
