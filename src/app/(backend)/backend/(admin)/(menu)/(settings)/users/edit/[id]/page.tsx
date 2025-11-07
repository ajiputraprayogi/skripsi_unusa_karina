"use client";

import React, { useEffect, useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useParams, useRouter } from "next/navigation";
import EditUserForm from "./EditUserForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

interface User {
  id: number;
  nama: string;
  email: string;
  roleId: number | null;
}

function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      setError("User ID tidak ditemukan");
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/backend/users/edit/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("User tidak ditemukan");
            // Optional: redirect bisa dilakukan di sini, contoh:
            // router.push("/backend/users");
          } else {
            throw new Error("Gagal mengambil data user");
          }
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error saat mengambil data");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [params.id, router]);

  if (loading) return <> 
    <PageBreadcrumb pageTitle="Data Roles" />
    <ComponentCard title="Form Edit Role">
      <p>Loading...</p>
    </ComponentCard>
  </>;

  if (error)
    return (
      <p className="text-center py-4 text-red-600">
        Error: {error}
      </p>
    );

  if (!user)
    return (
      <p className="text-center py-4">
        User tidak ditemukan
      </p>
    );

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Users" />
      <ComponentCard title="Form Edit User">
        <EditUserForm user={user} />
      </ComponentCard>
    </div>
  );
}

export default withPermission(EditUserPage, "edit-users");
