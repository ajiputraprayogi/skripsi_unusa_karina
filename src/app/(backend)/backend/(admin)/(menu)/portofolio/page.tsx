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
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import SkeletonTable from "@/components/skeleton/Table";
import AddPortofolioButton from "./AddPortofolioButton";
import Button from "@/components/ui/button/Button";

type Portfolio = {
  id: number;
  name: string;
  image?: string | null;
  description?: string | null;
  // ✅ PERBAIKAN: Tambahkan properti 'type' dan 'kategori'
  type?: string | null;
  kategori?: string | null;
};

function PortofolioPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [allPortofolio, setAllPortofolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const canAdd = useMemo(() => hasPermission(userPermissions, "add-portofolio"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-portofolio"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-portofolio"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Portofolio | Admin Panel";
    fetchPortofolio();
  }, []);

  async function fetchPortofolio() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/portofolio", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data portofolio");
      const data = await res.json();
      setAllPortofolio(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/portofolio/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus portfolio ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/portofolio/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus portfolio");

      setAllPortofolio((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Terhapus!", "Portofolio berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Portofolio" />
        <ComponentCard title="Data Portofolio Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Portofolio" />
      <ComponentCard
        title="Data Portofolio Table"
        headerRight={canAdd && <AddPortofolioButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Portofolio
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Type
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Kategori
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>


                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {allPortofolio.map((portfolio) => {
                    const description = portfolio.description ?? "";
                    const shortDescription =
                      description.length > 150
                        ? description.slice(0, 150) + "..."
                        : description || "Tidak ada deskripsi";

                    return (
                      <TableRow key={portfolio.id}>
                        {/* Kolom Portofolio */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            {portfolio.image ? (
                              <img
                                src={portfolio.image}
                                alt={portfolio.name}
                                className="h-32 w-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                              />
                            ) : (
                              <div className="h-32 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500">
                                No Image
                              </div>
                            )}

                            <div className="flex flex-col">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {portfolio.name}
                              </span>
                              <span className="block text-gray-500 text-sm dark:text-gray-400">
                                {shortDescription}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* ✅ Kolom Type (Fixed: Added 'type' to Portfolio type definition) */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {portfolio.type ?? "-"}
                        </TableCell>

                        {/* ✅ Kolom Kategori (Fixed: Added 'kategori' to Portfolio type definition) */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          {portfolio.kategori ?? "-"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-0">
                            {!canEdit && !canDelete && (
                              <span className="text-gray-400">No Actions</span>
                            )}
                            {canEdit && (
                              <Button
                                size="xs"
                                variant="warning"
                                onClick={() => handleEdit(portfolio.id)}
                              >
                                Edit
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                size="xs"
                                variant="danger"
                                className="ml-2"
                                onClick={() => handleDelete(portfolio.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default withPermission(PortofolioPage, "view-portofolio");