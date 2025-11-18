"use client";

import React, { createContext, useContext, useState } from "react";
// import { useSession } from "next-auth/react"; // DIHAPUS: Tidak perlu cek status login

type PermissionsContextType = {
    // ⚠️ Permissions dan roles dikosongkan
    permissions: string[];
    roles: string[];
    loading: boolean;
    refresh: () => Promise<void>;
    updateLocal: (newPermissions: string[], newRoles: string[]) => void;
};

// 1. Buat Context dengan nilai default kosong
const PermissionsContext = createContext<PermissionsContextType | undefined>({
    permissions: [],
    roles: [],
    loading: false, // Selalu false karena tidak ada yang dimuat
    refresh: async () => { console.warn("RBAC Logic Disabled: refresh called."); },
    updateLocal: () => { console.warn("RBAC Logic Disabled: updateLocal called."); },
});

// 2. Provider disederhanakan (Hanya wrapper)
export function PermissionsProvider({ children }: { children: React.ReactNode }) {
    
    // ⚠️ Hapus semua state dan useEffect yang berhubungan dengan RBAC
    // Kita langsung menggunakan nilai konstan dari default context di atas
    
    return (
        <PermissionsContext.Provider value={{
            permissions: [],
            roles: [],
            loading: false,
            refresh: async () => {},
            updateLocal: () => {},
        }}>
            {children}
        </PermissionsContext.Provider>
    );
}

// 3. Hook dipertahankan agar tidak ada crash di komponen lain
export function usePermissions() {
    const ctx = useContext(PermissionsContext);
    
    // Memberikan placeholder yang aman dan langsung siap pakai
    if (!ctx) {
        // Ini adalah fallback untuk kasus provider tidak digunakan
        return {
            permissions: [],
            roles: [],
            loading: false,
            refresh: async () => {},
            updateLocal: () => {},
        };
    }
    
    return ctx;
}