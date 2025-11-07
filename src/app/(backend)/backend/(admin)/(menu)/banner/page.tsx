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
import Button from "@/components/ui/button/Button";
import AddBannerButton from "./AddBannerButton";

type Banner = {
  id: number;
  image: string;
  is_active: boolean;
};

function BannerPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [allBanner, setAllBanner] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const canAdd = useMemo(() => hasPermission(userPermissions, "add-banner"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-banner"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-banner"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Banner | Admin Panel";
    fetchBanner();
  }, []);

  async function fetchBanner() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/banner", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data banner");
      const data = await res.json();
      setAllBanner(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/banner/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus banner ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/banner/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus banner");

      setAllBanner((prev) => prev.filter((b) => b.id !== id));
      Swal.fire("Terhapus!", "Banner berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Banner" />
        <ComponentCard title="Data Banner Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Banner" />
      <ComponentCard
        title="Data Banner Table"
        headerRight={canAdd && <AddBannerButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Banner
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Status
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {allBanner.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={`Banner ${banner.id}`}
                            className="h-32 w-64 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="h-32 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            banner.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {banner.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!canEdit && !canDelete && (
                            <span className="text-gray-400">No Actions</span>
                          )}
                          {canEdit && (
                            <Button
                              size="xs"
                              variant="warning"
                              onClick={() => handleEdit(banner.id)}
                            >
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => handleDelete(banner.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default withPermission(BannerPage, "view-banner");
