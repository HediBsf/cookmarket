"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardPath, getUserRole, isAuthenticated, UserRole } from "@/lib/auth";

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
        router.replace(getDashboardPath(role));
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
