"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { useRouter } from "next/navigation"; // import router hook
import Swal from 'sweetalert2'
import Button from "@/components/ui/button/Button";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
}


interface UserTableProps {
  users: User[];
}

export default function UserTable({ users = [] }: UserTableProps) {
  const router = useRouter();

  // Handler Edit: navigasi ke halaman edit user
  function handleEdit(id: number) {
    router.push(`/backend/users/edit/${id}`);
  }

  // Handler Delete: panggil API DELETE lalu refresh halaman
  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // batal hapus
    }

    try {
      const res = await fetch(`/api/backend/users/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Gagal menghapus data");

      Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      router.refresh(); // refresh data / halaman
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire("Error", error.message || "Terjadi kesalahan", "error");
      } else {
        Swal.fire("Error", "Terjadi kesalahan yang tidak diketahui", "error");
      }
    }

  }


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Nama
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.nama}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.role?.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Button size="xs" variant="warning" type="button" onClick={() => handleEdit(user.id)}>
                      Edit
                    </Button>
                    <Button size="xs" variant="danger" type="button" className="ml-2" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
