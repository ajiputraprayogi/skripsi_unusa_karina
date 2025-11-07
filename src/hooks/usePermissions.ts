"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export function usePermissions() {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    if (!session) {
      // kalau belum login → kosongkan state
      setPermissions([]);
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/backend/me/permissions", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Gagal memuat permissions");

      const data = await res.json();
      setPermissions(data.user.permissions || []);
      setRoles(data.user.roles || []);
    } catch (err) {
      console.error("usePermissions error:", err);
      setPermissions([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "loading") return; // tunggu next-auth siap
    fetchPermissions();

    // optional → auto refresh tiap 1 menit
    const interval = setInterval(fetchPermissions, 60_000);
    return () => clearInterval(interval);
  }, [status, fetchPermissions]);

  return { permissions, roles, loading, refresh: fetchPermissions };
}
