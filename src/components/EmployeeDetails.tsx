"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchEmployeeDetails,
  fetchEmployeeAccesses,
  Employee,
  Access,
} from "@/services/employeeService";
import EmployeeInfo from "@/components/EmployeeInfo";
import AccessTable from "@/components/AccessTable";
import SaveButton from "@/components/SaveButton";
import AddAccessModal from "@/components/AddAccessModal";
import EditEmployeeModal from "@/components/EditEmployeeModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast"; // Assuming you're using a toast hook for notifications

export default function EmployeeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [accessRights, setAccessRights] = useState<Access[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [employeeData, accessData] = await Promise.all([
        fetchEmployeeDetails(Number(id)),
        fetchEmployeeAccesses(Number(id)),
      ]);

      setEmployee(employeeData);
      setAccessRights(accessData);
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setError("Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  };

  const removeAccess = async (accessID: number) => {
    try {
      await fetch(
        `http://localhost:5000/api/employees/${id}/accesses/${accessID}`,
        {
          method: "DELETE",
        }
      );
      setAccessRights((prev) =>
        prev.filter((access) => access.accessID !== accessID)
      );
    } catch (err) {
      console.error("Error removing access:", err);
    }
  };

  // Add the updateStatus function here
  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/employees/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });

      toast({
        title: `Status updated to ${newStatus}!`,
      });

      fetchDetails(); // Refresh the page
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Failed to update status.",
        description: "Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!employee) return <p className="text-gray-500">Employee not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between mb-6">
        {/* Employee Info Section */}
        <EmployeeInfo employee={employee} />

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <AddAccessModal
            employeeId={employee.employeeID}
            onAccessAdded={fetchDetails}
          />
          <EditEmployeeModal employee={employee} onUpdate={fetchDetails} />
          <SaveButton employeeId={employee.employeeID} />
        </div>
      </div>

      {/* Add Status Update Buttons */}
      <div className="flex space-x-2 my-4">
        {employee.accountStatus !== "Inactive" && (
          <Button
            variant="destructive"
            onClick={() => updateStatus("Inactive")}
          >
            Mark as Inactive
          </Button>
        )}
        {employee.accountStatus !== "Active" && (
          <Button variant="default" onClick={() => updateStatus("Active")}>
            Mark as Active
          </Button>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Access Rights</h2>

      {/* Access Table Section */}
      <AccessTable accesses={accessRights} onRemoveAccess={removeAccess} />

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Employees
        </Button>
      </div>
    </div>
  );
}
