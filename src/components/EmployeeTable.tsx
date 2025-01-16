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
import AddEmployeeModal from "./AddEmployeeModal";
import { useRouter } from "next/navigation";

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
  const [search, setSearch] = useState(""); // Search term
  const [status, setStatus] = useState(""); // Filter by AccountStatus
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [totalEmployees, setTotalEmployees] = useState(0); // Total employees count

  const router = useRouter();

  const pageSize = 10; // Employees per page

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employees/search",
        {
          params: {
            search: search.trim() || null,
            status: status || null,
            page,
            pageSize,
          },
        }
      );
      const { employees = [], totalEmployees = 0 } = response.data;

      setEmployees(employees);
      setTotalEmployees(totalEmployees); // Set total count
      setTotalPages(Math.ceil(totalEmployees / pageSize));
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, status, page]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-screen-2xl">
      <h3 className="text-xl font-bold mb-4">
        Total Employees: <span>{totalEmployees}</span>
      </h3>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-3 w-full md:w-1/2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg p-3 w-full md:w-1/4"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <AddEmployeeModal
          onAdd={fetchEmployees}
          addEmployeeToTop={(newEmployee) =>
            setEmployees([newEmployee, ...employees])
          }
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>#</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : employees.length > 0 ? (
              employees.map((employee, index) => (
                <TableRow
                  key={employee.employeeID}
                  className="hover:bg-gray-50"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        employee.accountStatus === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {employee.accountStatus}
                    </span>
                  </TableCell>

                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/employees/${employee.employeeID}`)
                      }
                    >
                      View
                    </Button>
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
                <TableCell colSpan={7} className="text-center p-4">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
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
