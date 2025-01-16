import EmployeeTable from "@/components/EmployeeTable";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="p-6 w-full max-w-screen-2xl">
          <h1 className="text-6xl font-bold mb-6 text-center">
            Employee Management
          </h1>
          <div className="mb-6 flex justify-between items-center">
            {/* <h2 className="text-lg font-semibold">Employee Management</h2> */}
            {/* <AddEmployeeModal /> */}
          </div>
          <EmployeeTable />
        </main>
      </div>
    </Layout>
  );
}
