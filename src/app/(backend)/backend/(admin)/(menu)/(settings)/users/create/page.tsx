"use client";

import React, { useEffect } from "react";
// import withPermission from "@/components/auth/withPermission"; // DIHAPUS
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import CreateUserForm from "./CreateUserForm"; // ✅ Import komponen form yang sudah direvisi

function CreateUserPage() {
    useEffect(() => {
        document.title = "Tambah Users | Admin Panel";
    }, []);

    return (
        <div>
            <PageBreadcrumb pageTitle="Data Users" />
            <div className="space-y-6">
                <ComponentCard title="Form Tambah User">
                    {/* 📝 Tempat untuk Form Tambah User (CreateUserForm) */}
                    {/* Sekarang kita panggil komponen CreateUserForm di sini */}
                    <CreateUserForm />
                </ComponentCard>
            </div>
        </div>
    );
}

// ✅ Eksport komponen utama tanpa HOC withPermission
export default CreateUserPage;