import React from "react";
import { Access } from "../services/employeeService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface AccessTableProps {
  accesses: Access[];
  onRemoveAccess: (accessID: number) => void;
}

const AccessTable: React.FC<AccessTableProps> = ({
  accesses,
  onRemoveAccess,
}) => {
  if (accesses.length === 0) {
    return <p className="text-gray-600">No access rights assigned.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Application Name</TableHead>
          <TableHead>Date Granted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accesses.map((access, index) => (
          <TableRow
            key={access.accessID}
            className={`${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            } hover:bg-gray-200 transition-colors`}
          >
            <TableCell>{access.applicationName || "Unknown"}</TableCell>
            <TableCell>
              {new Date(access.dateGranted).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveAccess(access.accessID)}
              >
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccessTable;
