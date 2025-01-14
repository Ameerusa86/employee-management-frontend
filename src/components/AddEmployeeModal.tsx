"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function AddEmployeeModal({ onAdd }: { onAdd?: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    accountStatus: "Active", // Default account status
    dateCreated: new Date().toISOString(), // Set current date for DateCreated
    dateModified: new Date().toISOString(), // Set current date for DateModified
  });

  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/employees", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        jobTitle: "",
        accountStatus: "Active",
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
      toast({
        title: `${formData.firstName} ${formData.lastName} Added Successfully`,
        description: `The employee has been added successfully to the database and is now active, a new file has been created for the employee.`,
      });
      if (onAdd) {
        onAdd(); // Call parent function to refresh employee table
      } else {
        window.location.reload(); // Refresh the page if no onAdd function is provided
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: `${formData.firstName} ${formData.lastName} Failed to be Added`,
        description: "Failed to add employee",
        type: "foreground",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Employee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() =>
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  jobTitle: "",
                  accountStatus: "Active",
                  dateCreated: new Date().toISOString(),
                  dateModified: new Date().toISOString(),
                })
              }
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
