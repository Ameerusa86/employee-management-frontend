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

  const pageSize = 10; // Employees per page

  const fetchEmployees = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employees/search",
        {
          params: {
            search: search.trim() || null, // Send `null` if search is empty
            status: status || null, // Send `null` if no status is selected
            page,
            pageSize,
          },
        }
      );

      const { employees = [], totalEmployees = 0 } = response.data;

      // Set employees and total pages
      setEmployees(employees);
      setTotalPages(Math.ceil(totalEmployees / pageSize));
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
  }, [search, status, page]);

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-full">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Employee Management</h3>
        <AddEmployeeModal onAdd={fetchEmployees} />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg p-3"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-3"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="table-auto w-full border-collapse border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-left px-4 py-2">#</TableHead>
              <TableHead className="text-left px-4 py-2">First Name</TableHead>
              <TableHead className="text-left px-4 py-2">Last Name</TableHead>
              <TableHead className="text-left px-4 py-2">Email</TableHead>
              <TableHead className="text-left px-4 py-2">Job Title</TableHead>
              <TableHead className="text-left px-4 py-2">Status</TableHead>
              <TableHead className="text-left px-4 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : employees.length > 0 ? (
              employees.map((employee, index) => (
                <TableRow
                  key={employee.employeeID}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="px-4 py-2">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {employee.firstName}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {employee.lastName}
                  </TableCell>
                  <TableCell className="px-4 py-2">{employee.email}</TableCell>
                  <TableCell className="px-4 py-2">
                    {employee.jobTitle}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {employee.accountStatus}
                  </TableCell>
                  <TableCell className="px-4 py-2 flex gap-2">
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
                <TableCell colSpan={7} className="text-center py-4">
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
        <span className="text-gray-600">
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
