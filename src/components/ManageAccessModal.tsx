// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";

// interface ManageAccessModalProps {
//   employeeId: string;
//   onUpdate: () => void;
// }

// export default function ManageAccessModal({
//   employeeId,
//   onUpdate,
// }: ManageAccessModalProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     accessName: "",
//     description: "",
//     isActive: true,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   interface FormData {
//     accessName: string;
//     description: string;
//     isActive: boolean;
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       await axios.post(
//         `http://localhost:5000/api/accessrights/${employeeId}`,
//         formData
//       );
//       onUpdate(); // Refresh the employee details
//       setIsOpen(false); // Close the modal
//     } catch (error) {
//       console.error("Error adding access right:", error);
//     }
//   };

//   return (
//     <>
//       <Button onClick={() => setIsOpen(true)}>Add Access</Button>

//       {isOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2 className="text-xl font-bold mb-4">Add Access Right</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Access Name</label>
//                 <input
//                   type="text"
//                   name="accessName"
//                   value={formData.accessName}
//                   onChange={handleChange}
//                   className="input"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="textarea"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Active</label>
//                 <select
//                   name="isActive"
//                   value={formData.isActive.toString()}
//                   onChange={handleChange}
//                   className="select"
//                 >
//                   <option value="true">Yes</option>
//                   <option value="false">No</option>
//                 </select>
//               </div>
//               <div className="flex justify-end">
//                 <Button type="button" onClick={() => setIsOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="ml-2">
//                   Add Access
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
