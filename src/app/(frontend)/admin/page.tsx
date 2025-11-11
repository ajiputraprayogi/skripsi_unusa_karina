"use client";
import React from "react";
import { motion } from "framer-motion";

// Komponen halaman admin dengan tabel sederhana
export default function AdminTablePage() {
  const data = [
    { id: 1, name: "Dina", role: "Admin", status: "Active" },
    { id: 2, name: "Rico", role: "Editor", status: "Pending" },
    { id: 3, name: "Sari", role: "User", status: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-800/80 p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-2">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <button className="text-sm text-slate-300 hover:text-white text-left">Dashboard</button>
          <button className="text-sm text-slate-300 hover:text-white text-left">Users</button>
          <button className="text-sm text-slate-300 hover:text-white text-left">Settings</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">User Table</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl overflow-hidden border border-white/10 bg-slate-800/60"
        >
          <table className="w-full text-sm">
            <thead className="bg-slate-700/60">
              <tr className="text-slate-300 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-white/10 hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.role}</td>
                  <td className="px-4 py-2 text-slate-300">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
}