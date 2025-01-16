"use client";

import { useState, useEffect } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import AddAccessModal from "./AddAccessModal";

export default function AddEmployeeModal({ onAdd }: { onAdd?: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    accountStatus: "Active",
    company: "",
  });

  const [availableAccesses, setAvailableAccesses] = useState<string[]>([]); // List of accesses from the database
  const [selectedAccesses, setSelectedAccesses] = useState<string[]>([]); // Selected accesses
  const { toast } = useToast();

  // Fetch available accesses on component load
  useEffect(() => {
    const fetchAccesses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/applications"
        );
        setAvailableAccesses(
          response.data.map((application: any) => application.applicationName)
        );
      } catch (error) {
        console.error("Error fetching accesses:", error);
        toast({
          title: "Failed to Load Accesses",
          description:
            "Could not fetch available accesses. Please try again later.",
        });
      }
    };

    fetchAccesses();
  }, []);

  const handleAccessChange = (access: string, checked: boolean) => {
    setSelectedAccesses((prev) =>
      checked ? [...prev, access] : prev.filter((item) => item !== access)
    );
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Create the new employee
      const employeeResponse = await axios.post(
        "http://localhost:5000/api/employees",
        {
          ...formData,
          dateCreated: new Date().toISOString(),
          dateModified: new Date().toISOString(),
        }
      );

      const employeeId = employeeResponse.data.employeeID;

      // Step 2: Add the selected accesses for the new employee
      if (selectedAccesses.length > 0) {
        await Promise.all(
          selectedAccesses.map((accessName) =>
            axios.post(
              `http://localhost:5000/api/employees/${employeeId}/accesses`,
              {
                applicationName: accessName,
              }
            )
          )
        );
      }

      // Reset form data and selected accesses
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        jobTitle: "",
        accountStatus: "Active",
        company: "",
      });
      setSelectedAccesses([]);

      toast({
        title: `${formData.firstName} ${formData.lastName} Added Successfully`,
        description:
          "The employee and their accesses have been added successfully.",
      });

      if (onAdd) {
        onAdd(); // Refresh the employee table
      } else {
        window.location.reload(); // Refresh the page if no onAdd callback is provided
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: `${formData.firstName} ${formData.lastName} Failed to be Added`,
        description: "An error occurred while adding the employee or accesses.",
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
          <Input
            placeholder="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />

          {/* Add Accesses Section */}
          <div>
            <h3 className="text-lg font-bold">User Accesses</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {selectedAccesses.length > 0
                    ? `${selectedAccesses.length} Selected`
                    : "Select Accesses"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 space-y-2">
                {availableAccesses.map((access) => (
                  <div key={access} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedAccesses.includes(access)}
                      onCheckedChange={(checked: boolean) =>
                        handleAccessChange(access, !!checked)
                      }
                    />
                    <span>{access}</span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  jobTitle: "",
                  accountStatus: "Active",
                  company: "",
                });
                setSelectedAccesses([]);
              }}
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
