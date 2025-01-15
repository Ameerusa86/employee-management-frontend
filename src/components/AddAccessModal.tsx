"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface AddAccessModalProps {
  employeeId: number;
  onAccessAdded: () => void; // Callback to refresh access list
}

const predefinedAccesses = [
  { id: "aws", name: "AWS" },
  { id: "jira", name: "JIRA" },
  { id: "slack", name: "Slack" },
  { id: "github", name: "GitHub" },
  { id: "azure", name: "Azure" },
  { id: "salesforce", name: "Salesforce" },
];

export default function AddAccessModal({
  employeeId,
  onAccessAdded,
}: AddAccessModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccesses, setFilteredAccesses] = useState(predefinedAccesses);
  const [selectedAccess, setSelectedAccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredAccesses(
      predefinedAccesses.filter((access) =>
        access.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedAccess) {
      alert("Please select an access.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:5000/api/accessrights/${employeeId}`, {
        accessName: selectedAccess,
        dateGranted: new Date().toISOString(),
      });

      onAccessAdded(); // Refresh access list in the parent
      setIsOpen(false); // Close the modal
      setSelectedAccess(null); // Reset selection
      setSearchTerm(""); // Reset search
      setFilteredAccesses(predefinedAccesses); // Reset list
    } catch (err) {
      console.error("Error adding access:", err);
      alert("Failed to add access. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Access</Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Add Access Right</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search accesses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
              />
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedAccess || ""}
                  onChange={(e) => setSelectedAccess(e.target.value)}
                >
                  <option value="" disabled>
                    Select an access
                  </option>
                  {filteredAccesses.map((access) => (
                    <option key={access.id} value={access.name}>
                      {access.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedAccess(null); // Reset selection
                  setSearchTerm(""); // Reset search
                  setFilteredAccesses(predefinedAccesses); // Reset list
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedAccess}
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
