// "use client";

// import React, { useEffect, useState } from "react";
// import withPermission from "@/components/auth/withPermission";
// import { useRouter, useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Button from "@/components/ui/button/Button";
// import { usePermissions } from "@/context/PermissionsContext"; // 🔹 import hook

// type Permission = {
//   id: number;
//   name: string;
// };

// type RoleHasPermission = {
//   permission_id: number;
// };

// type RoleWithPermissions = {
//   id: number;
//   name: string;
//   role_has_permissions: RoleHasPermission[];
// };

// // ✅ Cache global biar permissions tidak di-fetch berulang
// let permissionsCache: Permission[] | null = null;

// function EditRole() {
//   const router = useRouter();
//   const params = useParams();
//   const { data: session } = useSession();
//   const { refresh, updateLocal, roles } = usePermissions();

//   const [name, setName] = useState("");
//   const [permissions, setPermissions] = useState<Permission[]>(permissionsCache || []);
//   const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   useEffect(() => {
//     if (!params.id) return;

//     let abortController = new AbortController();

//     async function fetchData() {
//       try {
//         if (permissionsCache) {
//           setPermissions(permissionsCache);
//         }

//         const [roleRes, permRes] = await Promise.all([
//           fetch(`/api/backend/roles/${params.id}`, { signal: abortController.signal }),
//           permissionsCache
//             ? null
//             : fetch("/api/backend/permissions", { signal: abortController.signal }),
//         ]);

//         if (!roleRes.ok) throw new Error("Gagal memuat role");
//         const roleData: RoleWithPermissions = await roleRes.json();

//         setName(roleData.name);
//         setSelectedPermissionIds(
//           roleData.role_has_permissions.map((rp) => rp.permission_id)
//         );

//         if (permRes) {
//           if (!permRes.ok) throw new Error("Gagal memuat permissions");
//           const permData: Permission[] = await permRes.json();
//           permissionsCache = permData;
//           setPermissions(permData);
//         }
//       } catch (error) {
//         if ((error as any).name !== "AbortError") {
//           alert(error instanceof Error ? error.message : "Terjadi kesalahan");
//         }
//       } finally {
//         setInitialLoading(false);
//       }
//     }

//     fetchData();

//     return () => abortController.abort();
//   }, [params.id]);

//   function togglePermission(id: number) {
//     setSelectedPermissionIds((prev) =>
//       prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
//     );
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(`/api/backend/roles/${params.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           permissionIds: selectedPermissionIds,
//         }),
//       });

//       if (!res.ok) throw new Error("Gagal update role");

//       // ✅ langsung refresh permission user login
//       await refresh();

//       router.push("/backend/roles");
//     } catch (error) {
//       alert(error instanceof Error ? error.message : "Gagal update role");
//     } finally {
//       setLoading(false);
//     }
//   }


//   if (initialLoading) {
//     return (
//       <>
//         <PageBreadcrumb pageTitle="Data Roles" />
//         <ComponentCard title="Form Edit Role">
//           <p>Loading...</p>
//         </ComponentCard>
//       </>
//     );
//   }

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Edit Role" />
//       <ComponentCard title="Form Edit Role">
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//           <div>
//             <Label>Nama Role</Label>
//             <Input
//               type="text"
//               id="name"
//               name="name"
//               value={name}
//               required
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Input Nama Role"
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <Label>Permissions</Label>
//             <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto border rounded p-2">
//               {permissions.length === 0 ? (
//                 <p className="text-gray-500">Memuat permissions...</p>
//               ) : (
//                 permissions.map((perm) => (
//                   <label key={perm.id} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedPermissionIds.includes(perm.id)}
//                       onChange={() => togglePermission(perm.id)}
//                       disabled={loading}
//                     />
//                     <span>{perm.name}</span>
//                   </label>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               size="sm"
//               className="mr-2"
//               variant="danger"
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault();
//                 router.back();
//               }}
//               disabled={loading}
//             >
//               Kembali
//             </Button>

//             <Button size="sm" variant="green" type="submit" disabled={loading}>
//               {loading ? "Menyimpan..." : "Simpan"}
//             </Button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// }

// export default withPermission(EditRole, "edit-roles");

// "use client";

// import React, { useEffect, useState } from "react";
// import withPermission from "@/components/auth/withPermission";
// import { useRouter, useParams } from "next/navigation";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Button from "@/components/ui/button/Button";
// import Checkbox from "@/components/form/input/Checkbox";

// type Permission = {
//   id: number;
//   name: string;
//   grup?: string;
// };

// type RoleWithPermissions = {
//   id: number;
//   name: string;
//   role_has_permissions: { permission_id: number }[];
// };

// // cache global
// let permissionsCache: Permission[] | null = null;

// function EditRole() {
//   const router = useRouter();
//   const params = useParams();

//   const [name, setName] = useState("");
//   const [permissions, setPermissions] = useState<Permission[]>(permissionsCache || []);
//   const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   useEffect(() => {
//     if (!params.id) return;

//     const abortController = new AbortController();

//     async function fetchData() {
//       try {
//         // load permissions
//         if (!permissionsCache) {
//           const permRes = await fetch("/api/backend/permissions", { signal: abortController.signal });
//           if (!permRes.ok) throw new Error("Gagal mengambil permissions");
//           const permData: Permission[] = await permRes.json();
//           permissionsCache = permData;
//           setPermissions(permData);
//         } else {
//           setPermissions(permissionsCache);
//         }

//         // load role
//         const roleRes = await fetch(`/api/backend/roles/${params.id}`, { signal: abortController.signal });
//         if (!roleRes.ok) throw new Error("Gagal memuat role");
//         const roleData: RoleWithPermissions = await roleRes.json();

//         setName(roleData.name);
//         setSelectedPermissions(roleData.role_has_permissions.map((rp) => rp.permission_id));
//       } catch (error) {
//         if ((error as any).name !== "AbortError") {
//           alert(error instanceof Error ? error.message : "Terjadi kesalahan");
//         }
//       } finally {
//         setInitialLoading(false);
//       }
//     }

//     fetchData();
//     return () => abortController.abort();
//   }, [params.id]);

//   function togglePermission(id: number) {
//     setSelectedPermissions((prev) =>
//       prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
//     );
//   }

//   function toggleAllGroupPermissions(groupPerms: Permission[]) {
//     const allSelected = groupPerms.every((p) => selectedPermissions.includes(p.id));
//     if (allSelected) {
//       setSelectedPermissions((prev) => prev.filter((id) => !groupPerms.some((p) => p.id === id)));
//     } else {
//       setSelectedPermissions((prev) => [...new Set([...prev, ...groupPerms.map((p) => p.id)])]);
//     }
//   }

//   function toggleAllPermissions() {
//     if (selectedPermissions.length === permissions.length) {
//       setSelectedPermissions([]);
//     } else {
//       setSelectedPermissions(permissions.map((p) => p.id));
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(`/api/backend/roles/${params.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           permissionIds: selectedPermissions,
//         }),
//       });

//       if (!res.ok) throw new Error("Gagal update role");

//       router.push("/backend/roles");
//     } catch (error) {
//       alert(error instanceof Error ? error.message : "Gagal update role");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // gruping permissions
//   const grupedPermissions = permissions.reduce((grups, perm) => {
//     const grupName = perm.grup || "Lainnya";
//     if (!grups[grupName]) grups[grupName] = [];
//     grups[grupName].push(perm);
//     return grups;
//   }, {} as Record<string, Permission[]>);

//   const allPermissionsSelected = selectedPermissions.length === permissions.length;

//   if (initialLoading) {
//     return (
//       <>
//         <PageBreadcrumb pageTitle="Edit Role" />
//         <ComponentCard title="Form Edit Role">
//           <p>Loading...</p>
//         </ComponentCard>
//       </>
//     );
//   }

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Edit Role" />
//       <ComponentCard title="Form Edit Role">
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//           <div>
//             <Label>Nama Role</Label>
//             <Input
//               type="text"
//               id="name"
//               name="name"
//               value={name}
//               required
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Input Nama Role"
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <Label>Permissions</Label>
//             <div className="space-y-4 overflow-auto border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-gray-200">
//               {Object.entries(grupedPermissions).map(([grupName, perms]) => {
//                 const allGroupSelected = perms.every((p) => selectedPermissions.includes(p.id));
//                 return (
//                   <div key={grupName} className="border rounded-md p-3 mb-3 dark:border-gray-700">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="font-semibold text-gray-700 dark:text-gray-100">{grupName}</p>
//                       <Checkbox
//                         checked={allGroupSelected}
//                         onCheckedChange={() => toggleAllGroupPermissions(perms)}
//                         label="Pilih Semua"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       {perms.map((perm) => (
//                         <Checkbox
//                           key={perm.id}
//                           checked={selectedPermissions.includes(perm.id)}
//                           onCheckedChange={() => togglePermission(perm.id)}
//                           disabled={loading}
//                           label={perm.name}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//               <div className="flex justify-end mt-2">
//                 <Checkbox
//                   checked={allPermissionsSelected}
//                   onCheckedChange={toggleAllPermissions}
//                   label="Pilih Semua Permissions"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               size="sm"
//               className="mr-2"
//               variant="danger"
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault();
//                 router.back();
//               }}
//               disabled={loading}
//             >
//               Kembali
//             </Button>

//             <Button size="sm" variant="green" type="submit" disabled={loading}>
//               {loading ? "Menyimpan..." : "Simpan"}
//             </Button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// }

// export default withPermission(EditRole, "edit-roles");


"use client";

import React, { useEffect, useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { usePermissions } from "@/context/PermissionsContext";

type Permission = {
  id: number;
  name: string;
  grup?: string;
};

type RoleWithPermissions = {
  id: number;
  name: string;
  role_has_permissions: { permission_id: number }[];
};

// ✅ cache global
let permissionsCache: Permission[] | null = null;

function EditRole() {
  const router = useRouter();
  const params = useParams();
  const { refresh } = usePermissions();

  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(permissionsCache || []);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // fetch role & permissions
  useEffect(() => {
    if (!params.id) return;
    const abortController = new AbortController();

    async function fetchData() {
      try {
        // render cepat pakai cache
        if (permissionsCache) setPermissions(permissionsCache);

        const [roleRes, permRes] = await Promise.all([
          fetch(`/api/backend/roles/${params.id}`, { signal: abortController.signal }),
          permissionsCache ? null : fetch("/api/backend/permissions", { signal: abortController.signal }),
        ]);

        if (!roleRes.ok) throw new Error("Gagal memuat role");
        const roleData: RoleWithPermissions = await roleRes.json();
        setName(roleData.name);
        setSelectedPermissions(roleData.role_has_permissions.map((rp) => rp.permission_id));

        if (permRes) {
          if (!permRes.ok) throw new Error("Gagal memuat permissions");
          const permData: Permission[] = await permRes.json();
          permissionsCache = permData;
          setPermissions(permData);
        }
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          alert(error instanceof Error ? error.message : "Terjadi kesalahan");
        }
      } finally {
        setInitialLoading(false);
      }
    }

    fetchData();
    return () => abortController.abort();
  }, [params.id]);

  // toggle satu permission
  function togglePermission(id: number) {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }

  // toggle semua permissions
  function toggleAllPermissions() {
    setSelectedPermissions((prev) =>
      prev.length === permissions.length ? [] : permissions.map((p) => p.id)
    );
  }

  // toggle semua per grup
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
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/roles/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          permissionIds: selectedPermissions,
        }),
      });

      if (!res.ok) throw new Error("Gagal update role");

      // ✅ refresh permission context secara global
      await refresh(); // pastikan fetch ulang dari server

      router.push("/backend/roles");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal update role");
    } finally {
      setLoading(false);
    }
  }

  // gruping permissions
  const grupedPermissions = permissions.reduce((grups, perm) => {
    const grupName = perm.grup || "Lainnya";
    if (!grups[grupName]) grups[grupName] = [];
    grups[grupName].push(perm);
    return grups;
  }, {} as Record<string, Permission[]>);

  const allPermissionsSelected = selectedPermissions.length === permissions.length;

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Edit Role" />
        <ComponentCard title="Form Edit Role">
          <p>Loading...</p>
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Role" />
      <ComponentCard title="Form Edit Role">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Nama Role</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Input Nama Role"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="space-y-4 overflow-auto border rounded p-2">
              {Object.entries(grupedPermissions).map(([grupName, perms]) => {
                const allGroupSelected = perms.every((p) => selectedPermissions.includes(p.id));
                return (
                  <div key={grupName} className="border rounded-md p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{grupName}</p>
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

export default withPermission(EditRole, "edit-roles");
