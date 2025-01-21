import React from "react";
import {
  fetchEmployeeDetails,
  fetchEmployeeAccesses,
} from "../services/employeeService";
import { generateFileContent, downloadFile } from "../utils/fileUtils";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  employeeId: number;
}

const SaveButton: React.FC<SaveButtonProps> = ({ employeeId }) => {
  const handleSaveToFile = async () => {
    try {
      const employee = await fetchEmployeeDetails(employeeId);
      const accesses = await fetchEmployeeAccesses(employeeId);

      const fileContent = generateFileContent(employee, accesses);
      const fileName = `${employee.firstName} ${employee.lastName}.txt`;

      downloadFile(fileContent, fileName);
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save the file. Please try again.");
    }
  };

  return (
    <Button variant="default" onClick={handleSaveToFile}>
      Download Details
    </Button>
  );
};

export default SaveButton;
