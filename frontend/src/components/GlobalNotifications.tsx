"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import NotificationToast from "@/components/NotificationToast";

type AppNotification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  orderId?: number | null;
  createdAt: string;
};

export default function GlobalNotifications() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<number[]>([]);

  useEffect(() => {
    setRole(getUserRole());
  }, [pathname]);

  useEffect(() => {
    if (role !== "CLIENT" && role !== "SELLER" && role !== "ADMIN") {
      setNotifications([]);
      return;
    }

    loadNotifications(role);
    const intervalId = window.setInterval(() => loadNotifications(role), 5000);
    return () => window.clearInterval(intervalId);
  }, [role]);

  async function loadNotifications(currentRole: string) {
    const path = currentRole === "CLIENT" ? "/api/notifications/client/me" : "/api/notifications/me";
    try {
      const data = await apiGet<AppNotification[]>(path);
      setNotifications(data);
    } catch {
      setNotifications([]);
    }
  }

  const latestUnreadNotification = useMemo(
    () => notifications.find((notification) => !notification.read && !dismissedNotificationIds.includes(notification.id)) ?? null,
    [notifications, dismissedNotificationIds],
  );

  async function markNotificationRead(id: number) {
    const path = role === "CLIENT" ? `/api/notifications/client/${id}/read` : `/api/notifications/${id}/read`;
    await apiPatch(path, {});
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  }

  function dismissNotification(id: number) {
    setDismissedNotificationIds((current) => current.includes(id) ? current : [...current, id]);
  }

  return (
    <NotificationToast
      notification={latestUnreadNotification}
      onClose={markNotificationRead}
      onDismiss={dismissNotification}
    />
  );
}
