"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddAccessModal from "@/components/AddAccessModal";
import EditEmployeeModal from "@/components/EditEmployeeModal";

interface Employee {
  employeeID: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  accountStatus: string;
}

interface AccessRight {
  accessID: number;
  applicationName: string;
  dateGranted: string;
}

export default function EmployeeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [accessRights, setAccessRights] = useState<AccessRight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [employeeResponse, accessRightsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/employees/${id}`),
        axios.get(`http://localhost:5000/api/employees/${id}/accesses`),
      ]);

      setEmployee(employeeResponse.data);
      setAccessRights(
        accessRightsResponse.data.map((access: any) => ({
          accessID: access.accessID,
          applicationName: access.application.applicationName, // Map applicationName
          dateGranted: access.dateGranted,
        }))
      );
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setError("Failed to fetch employee details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const removeAccess = async (accessID: number) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${id}/accesses/${accessID}`
      );
      setAccessRights((prev) =>
        prev.filter((access) => access.accessID !== accessID)
      );
    } catch (err) {
      console.error("Error removing access right:", err);
      alert("Failed to remove the access right. Please try again.");
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push("/")}>Back to Employees</Button>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Employee not found.</p>
        <Button onClick={() => router.push("/employees")}>
          Back to Employees
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-500 mt-2">
              <strong>Email: </strong>
              {employee.email}
            </p>
            <p className="text-gray-500 mt-1">
              <strong>Job Title:</strong> {employee.jobTitle || "N/A"}
            </p>
            <p className="text-gray-500 mt-1">
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  employee.accountStatus === "Active"
                    ? "text-green-600"
                    : "text-red-600"
                } font-medium`}
              >
                {employee.accountStatus}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <AddAccessModal
              employeeId={employee.employeeID}
              onAccessAdded={fetchEmployeeDetails} // Refresh access list
            />
            <EditEmployeeModal
              employee={{ ...employee, jobTitle: employee.jobTitle || "" }}
              onUpdate={fetchEmployeeDetails} // Refresh employee details
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">User Accesses</h2>
        {accessRights.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application Name</TableHead>
                <TableHead>Date Granted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRights.map((access) => (
                <TableRow key={access.accessID}>
                  <TableCell>{access.applicationName}</TableCell>
                  <TableCell>
                    {new Date(access.dateGranted).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAccess(access.accessID)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-600">No access rights assigned.</p>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Employees
          </Button>
        </div>
      </div>
    </div>
  );
}
