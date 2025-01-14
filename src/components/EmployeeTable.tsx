"use client";

import { useState, useEffect } from "react";
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
import EditEmployeeModal from "@/components/EditEmployeeModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface Employee {
  employeeID: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  accountStatus: string;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const pageSize = 10; // Employees per page

  const fetchEmployees = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      console.log("Response Data:", response.data); // Debug API response

      // Directly set employees if the API returns an array
      setEmployees(response.data);
      setTotalPages(1); // Set total pages to 1 as there's no pagination in this case
    } catch (error) {
      console.error(
        "Error fetching employees:",
        axios.isAxiosError(error) && error.response
          ? error.response.data
          : error
      );
      setEmployees([]); // Reset employees on error
      setTotalPages(1); // Reset total pages
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-lg font-bold mb-4">Employees</h3>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.employeeID}>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.accountStatus}</TableCell>
                <TableCell className="flex gap-2">
                  <EditEmployeeModal
                    employee={employee}
                    onUpdate={fetchEmployees}
                  />
                  <DeleteConfirmationModal
                    employeeId={employee.employeeID}
                    employeeName={`${employee.firstName} ${employee.lastName}`}
                    onDelete={fetchEmployees}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {isNaN(totalPages) ? 1 : totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
