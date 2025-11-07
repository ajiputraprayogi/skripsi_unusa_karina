"use client";

import React, { useState, useEffect } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";

type Permission = {
  id: number;
  name: string;
  grup?: string;
};

let permissionsCache: Permission[] | null = null;

function CreateRole() {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(permissionsCache || []);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!permissionsCache);
  const router = useRouter();

  useEffect(() => {
    if (permissionsCache) return;

    let abortController = new AbortController();

    async function fetchPermissions() {
      try {
        const res = await fetch("/api/backend/permissions", { signal: abortController.signal });
        if (!res.ok) throw new Error("Gagal mengambil permissions");
        const data: Permission[] = await res.json();

        permissionsCache = data;
        setPermissions(data);
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error(error);
          alert("Gagal mengambil permissions");
        }
      } finally {
        setInitialLoading(false);
      }
    }

    fetchPermissions();
    return () => abortController.abort();
  }, []);

  function togglePermission(id: number) {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }

  function toggleAllPermissions() {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((p) => p.id));
    }
  }

  function toggleAllGroupPermissions(groupPerms: Permission[]) {
    const allSelected = groupPerms.every((p) => selectedPermissions.includes(p.id));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !groupPerms.some((p) => p.id === id)));
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...groupPerms.map((p) => p.id)])]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Nama role wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/backend/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          permissions: selectedPermissions,
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat role");

      router.push("/backend/roles");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan role");
    } finally {
      setLoading(false);
    }
  }

  // gruping permissions by grup name
  const grupedPermissions = permissions.reduce((grups, perm) => {
    const grupName = perm.grup || "Lainnya";
    if (!grups[grupName]) grups[grupName] = [];
    grups[grupName].push(perm);
    return grups;
  }, {} as Record<string, Permission[]>);

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Roles" />
        <ComponentCard title="Form Tambah Role">
          <p>Loading permissions...</p>
        </ComponentCard>
      </>
    );
  }

  const allPermissionsSelected = selectedPermissions.length === permissions.length;

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Roles" />
      <ComponentCard title="Form Tambah Role">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Nama Role</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Input Nama Role"
              value={name}
              disabled={loading}
            />
          </div>

          <div>
            <Label>
              Permissions
            </Label>

            <div className="space-y-4 overflow-auto border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-gray-200">
              {Object.entries(grupedPermissions).map(([grupName, perms]) => {
                const allGroupSelected = perms.every((p) => selectedPermissions.includes(p.id));
                return (
                  <div key={grupName} className="border rounded-md p-3 mb-3 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-700 dark:text-gray-100">{grupName}</p>
                      <Checkbox
                        checked={allGroupSelected}
                        onCheckedChange={() => toggleAllGroupPermissions(perms)}
                        label="Pilih Semua"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <Checkbox
                          key={perm.id}
                          checked={selectedPermissions.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                          disabled={loading}
                          label={perm.name}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-end mt-2">
                <Checkbox
                  checked={allPermissionsSelected}
                  onCheckedChange={toggleAllPermissions}
                  label="Pilih Semua Permissions"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              className="mr-2"
              variant="danger"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
              disabled={loading}
            >
              Kembali
            </Button>

            <Button size="sm" variant="green" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(CreateRole, "add-roles");
