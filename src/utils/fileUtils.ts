import { Employee, Access } from "../services/employeeService";

// Generate file content
export const generateFileContent = (
  employee: Employee,
  accesses: Access[]
): string => {
  const lines = [
    `First Name: ${employee.firstName}`,
    `Last Name: ${employee.lastName}`,
    `Email: ${employee.email}`,
    `Job Title: ${employee.jobTitle || "N/A"}`,
    `Account Status: ${employee.accountStatus}`,
    `Date Created: ${new Date(employee.dateCreated).toLocaleString()}`,
    `Date Modified: ${new Date(employee.dateModified).toLocaleString()}`,
    "Accesses:",
  ];

  if (accesses.length > 0) {
    accesses.forEach((access) =>
      lines.push(
        `- ${access.applicationName} (Granted: ${new Date(
          access.dateGranted
        ).toLocaleDateString()})`
      )
    );
  } else {
    lines.push("No Accesses Assigned");
  }

  return lines.join("\n");
};

// Download file
export const downloadFile = (content: string, fileName: string): void => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
