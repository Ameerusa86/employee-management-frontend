import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Employee Management</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
