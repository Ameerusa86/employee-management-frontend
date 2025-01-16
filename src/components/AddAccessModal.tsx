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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Fetch all applications from the database
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/applications"
        );
        setAvailableApplications(response.data);
        setFilteredApplications(response.data); // Default to all applications
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Failed to Load Applications",
          description:
            "Could not fetch available applications. Please try again later.",
        });
      }
    };

    fetchApplications();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredApplications(
      availableApplications.filter((application: any) =>
        application.applicationName.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const toggleSelection = (applicationName: string) => {
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

    try {
      await Promise.all(
        selectedApplications.map((applicationName) =>
          axios.post(
            `http://localhost:5000/api/employees/${employeeId}/accesses`,
            {
              applicationName,
              dateGranted: new Date().toISOString(),
            }
          )
        )
      );

      onAccessAdded(); // Refresh access list in the parent
      setIsOpen(false); // Close the modal
      setSelectedApplications([]); // Reset selection
      setSearchTerm(""); // Reset search
      setFilteredApplications(availableApplications); // Reset list
    } catch (err) {
      console.error("Error adding application access:", err);
      toast({
        title: "Failed to Add Access",
        description: "An error occurred while adding access. Please try again.",
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
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleRowClick(application.applicationName)} // Toggle selection on row click
                  >
                    <div className="font-medium">
                      {application.applicationName}
                    </div>
                    <Checkbox
                      checked={selectedApplications.includes(
                        application.applicationName
                      )}
                      onCheckedChange={() =>
                        toggleSelection(application.applicationName)
                      }
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
