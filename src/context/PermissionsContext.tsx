"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type PermissionsContextType = {
  permissions: string[];
  roles: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (newPermissions: string[], newRoles: string[]) => void;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession(); // 🔹 cek status login
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Bersihkan sessionStorage saat logout
  useEffect(() => {
    if (status === "unauthenticated") {
      sessionStorage.removeItem("userPermissions");
      setPermissions([]);
      setRoles([]);
      setLoading(false);
    }
  }, [status]);

  // 🔹 Ambil dari cache saat mount pertama
  useEffect(() => {
    const cached = sessionStorage.getItem("userPermissions");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPermissions(parsed.permissions || []);
        setRoles(parsed.roles || []);
        setLoading(false);
      } catch {
        console.warn("Failed to parse userPermissions from sessionStorage");
      }
    }

    if (status === "authenticated") {
      fetchPermissions();
      const interval = setInterval(fetchPermissions, 60_000); // auto refresh setiap 1 menit
      return () => clearInterval(interval);
    }
  }, [status]);

  // 🔹 Fetch API dari backend
  async function fetchPermissions() {
    try {
      const res = await fetch("/api/backend/me/permissions", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Gagal memuat permissions");

      const data = await res.json();
      const newPermissions = data.user.permissions || [];
      const newRoles = data.user.roles || [];

      setPermissions(newPermissions);
      setRoles(newRoles);

      sessionStorage.setItem(
        "userPermissions",
        JSON.stringify({ permissions: newPermissions, roles: newRoles })
      );
    } catch (err) {
      console.error("fetchPermissions error:", err);
      setPermissions([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Update lokal tanpa fetch, untuk UI langsung responsive
  function updateLocal(newPermissions: string[], newRoles: string[]) {
    setPermissions(newPermissions);
    setRoles(newRoles);
    sessionStorage.setItem(
      "userPermissions",
      JSON.stringify({ permissions: newPermissions, roles: newRoles })
    );
  }

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        roles,
        loading,
        refresh: fetchPermissions,
        updateLocal,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

// 🔹 Hook untuk pakai permissions di komponen
export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}
