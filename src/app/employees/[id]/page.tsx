"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ManageAccessModal from "@/components/ManageAccessModal";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any>(null);
  const [accessRights, setAccessRights] = useState<any[]>([]);

  const fetchEmployeeDetails = async () => {
    try {
      const employeeResponse = await axios.get(
        `http://localhost:5000/api/employees/${id}`
      );
      setEmployee(employeeResponse.data);

      const accessRightsResponse = await axios.get(
        `http://localhost:5000/api/AccessRights/${id}`
      );
      setAccessRights(accessRightsResponse.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {employee ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-gray-600 mt-2">{employee.email}</p>
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
            <div className="mt-4 md:mt-0">
              <ManageAccessModal
                employeeId={employee.employeeID}
                onUpdate={fetchEmployeeDetails}
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Access Rights
          </h2>
          {accessRights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessRights.map((access) => (
                <div
                  key={access.accessID}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <p className="text-lg font-semibold text-gray-700">
                    {access.websiteTool}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Access Type:</strong> {access.accessType}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Assigned On:</strong>{" "}
                    {new Date(access.dateAssigned).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No access rights assigned.</p>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => history.back()}>
              Back to Employees
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
}
