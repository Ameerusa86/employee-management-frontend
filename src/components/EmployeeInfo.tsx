import React from "react";
import { Employee } from "../services/employeeService";

interface EmployeeInfoProps {
  employee: Employee;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ employee }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      {employee.firstName} {employee.lastName}
    </h1>
    <p className="text-gray-500 mt-2">
      <strong>Email: </strong> {employee.email}
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
);

export default EmployeeInfo;
