"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AddAccessModalProps {
  employeeId: number;
  onAccessAdded: () => void; // Callback to refresh access list
}

export default function AddAccessModal({
  employeeId,
  onAccessAdded,
}: AddAccessModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [availableApplications, setAvailableApplications] = useState<any[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  ); // Selected applications
  const [existingAccesses, setExistingAccesses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Fetch existing accesses and available applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all applications and accesses
        const [applicationsResponse, accessesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/applications"),
          axios.get(
            `http://localhost:5000/api/employees/${employeeId}/accesses`
          ),
        ]);

        const applications = applicationsResponse.data;
        const accesses = accessesResponse.data.map((access: any) => {
          return access.application?.applicationName || "Unknown";
        });

        setAvailableApplications(applications);
        setFilteredApplications(applications);
        setExistingAccesses(accesses);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Failed to Load Data",
          description:
            "Could not fetch applications or accesses. Please try again later.",
        });
      }
    };

    fetchData();
  }, [employeeId]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredApplications(
      availableApplications.filter((application: any) =>
        application.applicationName.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const toggleSelection = (applicationName: string) => {
    if (existingAccesses.includes(applicationName)) {
      toast({
        title: "Duplicate Access",
        description: `${applicationName} is already assigned to this employee.`,
      });
      return;
    }

    setSelectedApplications(
      (prevSelected) =>
        prevSelected.includes(applicationName)
          ? prevSelected.filter((name) => name !== applicationName) // Deselect
          : [...prevSelected, applicationName] // Select
    );
  };

  const handleRowClick = (applicationName: string) => {
    toggleSelection(applicationName);
  };

  const handleSubmit = async () => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No Applications Selected",
        description:
          "Please select at least one application before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    const failedApplications: string[] = [];
    const duplicateApplications: string[] = [];

    try {
      await Promise.all(
        selectedApplications.map(async (applicationName) => {
          try {
            const response = await axios.post(
              `http://localhost:5000/api/employees/${employeeId}/accesses`,
              { applicationName }
            );
            if (response.status === 409) {
              duplicateApplications.push(applicationName);
            }
          } catch (err: any) {
            if (err.response?.status === 409) {
              duplicateApplications.push(applicationName);
            } else {
              failedApplications.push(applicationName);
            }
          }
        })
      );

      if (duplicateApplications.length > 0) {
        toast({
          title: "Duplicate Accesses",
          description: `The following accesses already exist: ${duplicateApplications.join(
            ", "
          )}.`,
        });
      }

      if (failedApplications.length > 0) {
        toast({
          title: "Failed to Add Access",
          description: `Failed to add the following accesses: ${failedApplications.join(
            ", "
          )}.`,
        });
      }

      if (
        duplicateApplications.length === 0 &&
        failedApplications.length === 0
      ) {
        toast({
          title: "Accesses Added Successfully",
          description: "The selected accesses have been added.",
        });
      }

      onAccessAdded(); // Refresh the access list
      setIsOpen(false); // Close modal
      setSelectedApplications([]); // Reset selection
    } catch (error) {
      console.error("Error adding accesses:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding accesses.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Application Access</Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add Application Access</h2>

            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 mb-4"
              />
              <ScrollArea className="h-60 border rounded-lg overflow-y-auto p-2">
                {filteredApplications.map((application: any) => (
                  <div
                    key={application.applicationID}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                      selectedApplications.includes(application.applicationName)
                        ? "bg-blue-100"
                        : existingAccesses.includes(application.applicationName)
                        ? "bg-red-100 text-gray-500 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      !existingAccesses.includes(application.applicationName) &&
                      handleRowClick(application.applicationName)
                    }
                  >
                    <div className="font-medium">
                      {application.applicationName || "Unknown"}
                    </div>
                    <Checkbox
                      checked={selectedApplications.includes(
                        application.applicationName
                      )}
                      onCheckedChange={() =>
                        toggleSelection(application.applicationName)
                      }
                      disabled={existingAccesses.includes(
                        application.applicationName
                      )}
                    />
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedApplications([]);
                  setSearchTerm("");
                  setFilteredApplications(availableApplications);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                onClick={handleSubmit}
                disabled={isSubmitting || selectedApplications.length === 0}
              >
                {isSubmitting ? "Adding..." : "Add Access"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
