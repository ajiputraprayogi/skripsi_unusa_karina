"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch data user
  const fetchUsers = async () => {
    const res = await fetch("/dummyapi/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Submit form tambah user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/dummyapi/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setName("");
    setEmail("");
    fetchUsers();
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          📋 Daftar Pengguna
        </h1>

        {/* Form tambah user */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Tambah User
          </motion.button>
        </form>

        {/* List user */}
        <motion.ul
          layout
          className="space-y-3"
        >
          {users.map((user) => (
            <motion.li
              key={user.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
