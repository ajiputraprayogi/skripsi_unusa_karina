"use client";

import { usePermissions } from "@/context/PermissionsContext";
import { hasPermission } from "@/utils/hasPermission";
import React from "react";

function ForbiddenPage({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-700">403</h1>
      <p className="mt-4 text-lg text-gray-500">
        {message || "Anda tidak memiliki akses ke halaman ini."}
      </p>
    </div>
  );
}

export default function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: string
) {
  const ProtectedComponent: React.FC<P> = (props) => {
    const { permissions, loading } = usePermissions();

    if (loading) {
      return <p>Checking permission...</p>;
    }

    if (!hasPermission(permissions, requiredPermission)) {
      return <ForbiddenPage />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  ProtectedComponent.displayName = `WithPermission(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ProtectedComponent;
}
