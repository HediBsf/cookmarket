"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle, Clock3, RefreshCw, Trash2, Truck } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiDelete, apiGet, apiPatch } from "@/lib/api";

type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "DELIVERING" | "DELIVERED" | "CANCELLED";

type Seller = {
  firstName: string;
  lastName: string;
  city?: string | null;
};

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  dish?: { name: string; seller?: Seller | null } | null;
  formation?: { title: string; seller?: Seller | null } | null;
};

type Order = {
  id: number;
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryCity: string;
  paymentMethod: string;
  paymentStatus: string;
  d17PhoneNumber?: string | null;
  d17TransferReference?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

type ClientNotification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  orderId?: number | null;
  createdAt: string;
};

const statusSteps: Array<{ value: OrderStatus; label: string }> = [
  { value: "PENDING", label: "En attente" },
  { value: "ACCEPTED", label: "Acceptee" },
  { value: "PREPARING", label: "Preparation" },
  { value: "READY", label: "Prete" },
  { value: "DELIVERING", label: "Livraison" },
  { value: "DELIVERED", label: "Livree" },
];

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [showAllUnreadNotifications, setShowAllUnreadNotifications] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders(options: { silent?: boolean } = {}) {
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const [data, clientNotifications] = await Promise.all([
        apiGet<Order[]>("/api/orders/me"),
        apiGet<ClientNotification[]>("/api/notifications/client/me"),
      ]);
      setOrders(data);
      setNotifications(clientNotifications);
      setLastUpdatedAt(new Date());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement des commandes impossible.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const intervalId = window.setInterval(() => loadOrders({ silent: true }), 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.status)).length,
    delivered: orders.filter((order) => order.status === "DELIVERED").length,
  }), [orders]);
  const unreadNotifications = useMemo(() => notifications.filter((notification) => !notification.read), [notifications]);
  const displayedNotifications = showAllUnreadNotifications
    ? unreadNotifications
    : unreadNotifications.slice(0, 3);

  async function markNotificationRead(id: number) {
    await apiPatch(`/api/notifications/client/${id}/read`, {});
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  }

  async function markNotificationUnread(id: number) {
    await apiPatch(`/api/notifications/client/${id}/unread`, {});
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: false } : notification));
  }

  async function deleteNotification(id: number) {
    await apiDelete(`/api/notifications/client/${id}`);
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main className="page-container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="badge">Suivi client</span>
            <h1 className="section-title mt-4">Mes commandes</h1>
            <p className="mt-2 text-stone-600">Suivez le statut de vos plats et formations en temps reel.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
              {lastUpdatedAt ? `Mis a jour a ${lastUpdatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Synchronisation..."}
            </span>
            <button className="btn-secondary flex items-center gap-2 py-2" onClick={() => loadOrders({ silent: true })} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Stat icon={<Clock3 />} label="Total commandes" value={stats.total} />
          <Stat icon={<Truck />} label="En cours" value={stats.active} />
          <Stat icon={<CheckCircle />} label="Livrees" value={stats.delivered} />
        </div>

        {error ? <div className="card mb-6 border-red-200 bg-red-50 p-5 text-red-700">{error}</div> : null}
        {unreadNotifications.length > 0 ? (
          <div className="card mb-6 border-green-200 bg-green-50 p-5 text-green-800">
            <span className="inline-flex items-center gap-2 font-semibold">
              <Bell size={18} />
              {unreadNotifications.length} notification(s) de commande non lue(s)
            </span>
          </div>
        ) : null}

        {unreadNotifications.length > 0 ? (
          <section className="card mb-8 p-5">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-extrabold">Notifications</h2>
                <p className="text-sm text-stone-500">Les dernieres notifications non lues de vos commandes.</p>
              </div>
              <span className="badge-muted">{unreadNotifications.length} non lue(s)</span>
            </div>
            <div className="grid gap-3">
              {displayedNotifications.map((notification) => (
                <div key={notification.id} className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <span className="badge">Non lue</span>
                      <h3 className="mt-2 font-extrabold text-stone-950">{notification.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">{notification.message}</p>
                      <p className="mt-2 text-xs text-stone-400">{new Date(notification.createdAt).toLocaleString("fr-FR")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-primary py-2" onClick={() => markNotificationRead(notification.id)}>Marquer lue</button>
                      <button className="btn-danger flex items-center gap-2 py-2" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {unreadNotifications.length > 3 ? (
              <button className="btn-secondary mt-4 w-full py-2" onClick={() => setShowAllUnreadNotifications((value) => !value)}>
                {showAllUnreadNotifications ? "Voir moins" : `Voir plus (${unreadNotifications.length - 3})`}
              </button>
            ) : null}
          </section>
        ) : null}
        {loading ? <div className="card p-8 text-center">Chargement des commandes...</div> : null}

        {!loading && orders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg text-stone-600">Vous n'avez pas encore de commande.</p>
            <a href="/dishes" className="btn-primary mt-4 inline-flex">Explorer les plats</a>
          </div>
        ) : null}

        <div className="grid gap-6">
          {orders.map((order) => (
            <article key={order.id} className="card p-5">
              <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className={order.status === "CANCELLED" ? "badge-muted" : "badge"}>{getStatusLabel(order.status)}</span>
                  <h2 className="mt-3 text-2xl font-extrabold">Commande #{order.id}</h2>
                  <p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-extrabold text-red-900">{order.totalPrice.toFixed(2)} DT</p>
                  <p className="text-sm font-semibold text-stone-600">{order.paymentMethod === "D17_TRANSFER" ? "Paiement D17" : "Paiement a la livraison"}</p>
                </div>
              </div>

              <StatusTimeline status={order.status} />

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const name = item.dish?.name ?? item.formation?.title ?? "Article";
                    const seller = item.dish?.seller ?? item.formation?.seller;
                    return (
                      <div key={item.id} className="rounded-lg border border-amber-900/10 bg-amber-50/60 p-3">
                        <p className="font-bold">{name}</p>
                        <p className="mt-1 text-sm text-stone-600">Quantite {item.quantity} - {item.subtotal.toFixed(2)} DT</p>
                        {seller ? <p className="mt-1 text-xs font-semibold text-stone-500">Vendeur: {seller.firstName} {seller.lastName}</p> : null}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700">
                  <h3 className="font-extrabold text-stone-950">Details</h3>
                  <p className="mt-3"><strong>Adresse:</strong> {order.deliveryAddress}</p>
                  {order.deliveryCity ? <p><strong>Ville:</strong> {order.deliveryCity}</p> : null}
                  {order.paymentMethod === "D17_TRANSFER" ? (
                    <>
                      <p className="mt-3"><strong>Numero D17:</strong> {order.d17PhoneNumber || "-"}</p>
                      <p><strong>Reference:</strong> {order.d17TransferReference || "-"}</p>
                      <p><strong>Paiement:</strong> {getPaymentLabel(order.paymentStatus)}</p>
                    </>
                  ) : (
                    <p className="mt-3"><strong>Paiement:</strong> a la livraison</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 font-semibold text-red-700">Commande annulee</div>;
  }

  const activeIndex = statusSteps.findIndex((step) => step.value === status);
  return (
    <div className="mt-5 grid gap-2 md:grid-cols-6">
      {statusSteps.map((step, index) => {
        const active = index <= activeIndex;
        return (
          <div key={step.value} className={`rounded-lg border p-3 text-center text-xs font-bold ${active ? "border-green-200 bg-green-50 text-green-800" : "border-stone-200 bg-stone-50 text-stone-400"}`}>
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="card p-5"><div className="mb-3 inline-flex rounded-lg bg-amber-50 p-3 text-red-900">{icon}</div><p className="text-sm text-stone-500">{label}</p><h2 className="mt-1 text-3xl font-extrabold">{value}</h2></div>;
}

function getStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "En attente",
    ACCEPTED: "Acceptee",
    PREPARING: "En preparation",
    READY: "Prete",
    DELIVERING: "En livraison",
    DELIVERED: "Livree",
    CANCELLED: "Annulee",
  };
  return labels[status];
}

function getPaymentLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    WAITING_SELLER_CONFIRMATION: "En attente de confirmation vendeur",
    SELLER_CONFIRMED: "Confirme par le vendeur",
    SELLER_PAID: "Vendeur paye",
  };
  return labels[status] || status;
}
