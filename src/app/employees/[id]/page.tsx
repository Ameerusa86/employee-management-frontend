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
      setAccessRights(accessData || []); // Ensure accessRights is always an array
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

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  if (!employee)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Employee not found.</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 w-full max-w-5xl bg-white shadow-md rounded-lg">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
          <p className="text-gray-500 mt-2">
            Manage and view all information related to this employee, including
            their assigned access rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Employee Info Section */}
          <div className="md:col-span-2">
            <EmployeeInfo employee={employee} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <AddAccessModal
              employeeId={employee.employeeID}
              onAccessAdded={fetchDetails}
            />
            <EditEmployeeModal employee={employee} onUpdate={fetchDetails} />
            <SaveButton employeeId={employee.employeeID} />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Back to Employees
            </Button>
          </div>
        </div>

        {/* Access Rights Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Access Rights
        </h2>
        <div className="bg-white p-4 shadow-sm rounded-md">
          {accessRights.length > 0 ? (
            <AccessTable
              accesses={accessRights}
              onRemoveAccess={removeAccess}
            />
          ) : (
            <p className="text-gray-600">No access rights assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}
