"use client";

import React, { useState, useEffect } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";



function CreatePermission() {
  useEffect(() => {
      document.title = "Tambah Permission | Admin Panel";
  }, []);
  
  const [name, setName] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const Loading = async () => {
      // await delay(2000); // Simulasi loading awal 5 detik
      setInitialLoading(false);
    };

    Loading();
  }, []);

  if (initialLoading) {
    return <>
      <PageBreadcrumb pageTitle="Data Permissions" />
      <ComponentCard title="Form Tambah Permission">
        <SkeletonDefault />
      </ComponentCard>
    </>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/backend/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);


    if (res.ok) {
      router.push("/backend/permissions");
    } else {
      alert("Gagal menambahkan permission");
    }
  }

  return (
    <div>
        <PageBreadcrumb pageTitle="Data Permissions" />
        <div className="space-y-6">
            <ComponentCard title="Form Tambah Permission">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                        <Label>Nama Permission</Label>
                        <Input 
                            type="text" 
                            id="name" 
                            name="name" 
                            required
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Input Nama Permission"/>
                        </div>
                        <div></div>
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
    </div>
  );
}

export default withPermission(CreatePermission, "add-permissions");