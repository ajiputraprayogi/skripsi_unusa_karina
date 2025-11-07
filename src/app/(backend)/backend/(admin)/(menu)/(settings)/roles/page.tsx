"use client";

import React, { useEffect, useState, useMemo } from "react";
import { hasPermission } from "@/utils/hasPermission";
import { usePermissions } from "@/context/PermissionsContext";
import withPermission from "@/components/auth/withPermission";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import AddRolesButton from "./AddRolesButton";
import SkeletonTable from "@/components/skeleton/Table";

type Role = {
  id: number;
  name: string;
};

function RolesPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } =
    usePermissions();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Precompute sekali, biar nggak cek permission berulang
  const canAdd = useMemo(
    () => hasPermission(userPermissions, "add-roles"),
    [userPermissions]
  );
  const canEdit = useMemo(
    () => hasPermission(userPermissions, "edit-roles"),
    [userPermissions]
  );
  const canDelete = useMemo(
    () => hasPermission(userPermissions, "delete-roles"),
    [userPermissions]
  );

  useEffect(() => {
    document.title = "Data Roles | Admin Panel";
    fetchRoles();
  }, []);

  async function fetchRoles() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/roles", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data roles");
      const data = await res.json();
      setRoles(data);
    } catch (err: unknown) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/roles/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus role ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/roles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus role");

      // ✅ Optimistic update: langsung hapus dari state
      setRoles((prev) => prev.filter((r) => r.id !== id));

      Swal.fire("Terhapus!", "Role berhasil dihapus.", "success");

      // optional → bisa dipakai kalau mau sync ulang dari DB
      // await fetchRoles();
    } catch (err: unknown) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Terjadi kesalahan",
        "error"
      );
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Roles" />
        <ComponentCard
          title="Data Roles Table"
          headerRight={canAdd && <AddRolesButton />}
        >
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Roles" />
      <ComponentCard
        title="Data Roles Table"
        headerRight={canAdd && <AddRolesButton />}
      >
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama Role
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
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {role.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {canEdit && (
                    <Button
                      size="xs"
                      variant="warning"
                      onClick={() => handleEdit(role.id)}
                    >
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="xs"
                      variant="danger"
                      className="ml-2"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </Button>
                  )}
                  {!canEdit && !canDelete && (
                    <span className="text-gray-400">No Actions</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ComponentCard>
    </div>
  );
}

// ✅ hanya user dengan "view-roles" yg bisa akses halaman ini
export default withPermission(RolesPage, "view-roles");
