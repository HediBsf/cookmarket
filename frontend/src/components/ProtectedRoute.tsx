"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserRole, isAuthenticated, UserRole } from "@/lib/auth";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    if (allowedRoles) {
      const role = getUserRole();
      if (!role || !allowedRoles.includes(role)) {
        router.replace(role === "SELLER" ? "/seller/dashboard" : "/");
        return;
      }
    }

    setReady(true);
  }, [router, allowedRoles]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
