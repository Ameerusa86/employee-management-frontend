"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ManageAccessModal({
  employeeId,
  onUpdate,
}: {
  employeeId: number;
  onUpdate: () => void;
}) {
  const [accessTypes, setAccessTypes] = useState([]); // Predefined list from the backend
  const [selectedAccessTypeId, setSelectedAccessTypeId] = useState<
    number | null
  >(null); // Selected access type ID
  const [websiteTool, setWebsiteTool] = useState(""); // Tool/website name
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch predefined access types
  useEffect(() => {
    const fetchAccessTypes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/AccessTypes"
        );
        setAccessTypes(response.data);
      } catch (error) {
        console.error("Error fetching access types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessTypes();
  }, []);

  // Add new access for the employee
  const handleAddAccess = async () => {
    if (!selectedAccessTypeId) {
      alert("Please select an access type.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/AccessRights", {
        employeeID: employeeId,
        websiteTool,
        accessTypeId: selectedAccessTypeId, // Send the selected access type ID
      });
      onUpdate(); // Refresh the parent component
      setWebsiteTool(""); // Reset the form
      setSelectedAccessTypeId(null);
    } catch (error) {
      console.error("Error adding access:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Access</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Access Rights</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Dropdown for Access Types */}
          <select
            value={selectedAccessTypeId ?? ""}
            onChange={(e) => setSelectedAccessTypeId(Number(e.target.value))}
            className="border rounded p-2 w-full"
            disabled={isLoading}
          >
            <option value="">Select Access Type</option>
            {accessTypes.map(
              (type: { accessTypeID: number; accessName: string }) => (
                <option key={type.accessTypeID} value={type.accessTypeID}>
                  {type.accessName}
                </option>
              )
            )}
          </select>

          {/* Input for Website/Tool */}
          <input
            type="text"
            placeholder="Website/Tool"
            value={websiteTool}
            onChange={(e) => setWebsiteTool(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedAccessTypeId(null);
              setWebsiteTool("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAddAccess}>Add Access</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
