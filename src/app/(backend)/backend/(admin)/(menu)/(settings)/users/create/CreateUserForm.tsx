"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from "@/components/ui/button/Button";

type RoleOption = {
  value: number;
  label: string;
};

export default function CreateUserForm() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [role, setRole] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/backend/roles");
        const data = await res.json();

        const options = data.map((role: { id: number; name: string }) => ({
          value: role.id,
          label: role.name,
        }));

        setRoleOptions(options);
      } catch (error) {
        console.error("Gagal ambil roles:", error);
      }
    }

    fetchRoles();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/backend/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, roleId: role, password }),
      });

      const data = await res.json();
if (!res.ok) {
  console.error("API error:", data);
  alert(data.error || "Gagal membuat user");
  setLoading(false);
  return;
}


      router.push("/backend/users");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat user");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <Label>Nama</Label>
        <Input 
          type="text" 
          id="nama" 
          name="nama" 
          required
          onChange={(e) => setNama(e.target.value)}
          placeholder="Input Nama"
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input 
          type="email" 
          id="email" 
          name="email" 
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Input Email"
        />
      </div>

      <div>
        <Label>Role</Label>
        <Select
          options={roleOptions}
          placeholder="Pilih Role"
          value={role} // number | undefined
          onChange={(val) => {
            // val bisa string karena HTML select value selalu string
            const num = Number(val);
            if (!isNaN(num)) setRole(num);
          }}
          className="dark:bg-dark-900"
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input 
          type="password" 
          id="password" 
          name="password" 
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Input Password"
        />
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
  );
}
