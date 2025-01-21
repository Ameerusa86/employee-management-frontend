import axios from "axios";

export interface Employee {
  employeeID: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string; // Remove | undefined
  accountStatus: string;
  dateCreated: string;
  dateModified: string;
}

export interface Access {
  accessID: number;
  applicationName: string;
  dateGranted: string;
}

// Fetch employee details
export const fetchEmployeeDetails = async (
  employeeId: number
): Promise<Employee> => {
  const response = await axios.get<Employee>(
    `http://localhost:5000/api/employees/${employeeId}`
  );
  return response.data;
};

// Fetch access rights for the employee
export async function fetchEmployeeAccesses(
  employeeId: number
): Promise<Access[]> {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/employees/${employeeId}/accesses`
    );

    return response.data.map((access: any) => ({
      accessID: access.accessID,
      applicationName: access.applicationName || "Unknown", // Map correctly
      dateGranted: access.dateGranted,
    }));
  } catch (error) {
    console.error("Failed to fetch employee accesses:", error);
    throw error;
  }
}
