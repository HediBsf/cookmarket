"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCircle, ClipboardList, GraduationCap, Plus, RefreshCw, Soup, Trash2, Wifi } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth";

type Tab = "overview" | "orders" | "dishes" | "formations";
type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "DELIVERING" | "DELIVERED" | "CANCELLED";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  city: string;
  allergens?: string;
  preparationTime?: number;
  categoryId?: number;
  availability: boolean;
};

type Formation = {
  id: number;
  title: string;
  description: string;
  price: number;
  duration?: string;
  level?: string;
  imageUrl?: string;
  availability: boolean;
};

type ContactUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
};

type Order = {
  id: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  totalPrice: number;
  sellerSubtotal?: number;
  status: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: string;
  d17PhoneNumber?: string | null;
  d17TransferReference?: string | null;
  d17TransferProof?: string | null;
  sellerPaid: boolean;
  createdAt: string;
  client?: ContactUser;
  items: Array<{ id: number; quantity: number; unitPrice: number; subtotal: number; dish?: Dish | null; formation?: Formation | null }>;
};

type SellerSubscription = {
  role: "CLIENT" | "SELLER" | "ADMIN";
  sellerSubscriptionStatus: string;
  sellerSubscriptionExpiresAt?: string | null;
  sellerSubscriptionReference?: string | null;
  sellerD17PhoneNumber?: string | null;
  amount: number;
  d17PhoneNumber: string;
};

type LivePoint = {
  time: string;
  commandes: number;
  revenus: number;
};

type SellerNotification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  orderId?: number | null;
  createdAt: string;
};

const emptyDish = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  quantity: "1",
  city: "",
  allergens: "",
  preparationTime: "",
  categoryId: "",
  availability: true,
};

const emptyFormation = {
  title: "",
  description: "",
  price: "",
  duration: "",
  level: "",
  imageUrl: "",
  availability: true,
};

const statuses: OrderStatus[] = ["PENDING", "ACCEPTED", "PREPARING", "READY", "DELIVERING", "DELIVERED", "CANCELLED"];

export default function SellerDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [dishForm, setDishForm] = useState(emptyDish);
  const [formationForm, setFormationForm] = useState(emptyFormation);
  const [editingDishId, setEditingDishId] = useState<number | null>(null);
  const [editingFormationId, setEditingFormationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState<SellerSubscription | null>(null);
  const [subscriptionForm, setSubscriptionForm] = useState({ reference: "", proof: "", sellerD17PhoneNumber: "" });
  const [submittingSubscription, setSubmittingSubscription] = useState(false);
  const [livePoints, setLivePoints] = useState<LivePoint[]>([]);
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const knownOrderIds = useRef<Set<number>>(new Set());

  const user = getCurrentUser();

  async function loadData(options: { silent?: boolean } = {}) {
    if (!user) {
      setLoading(false);
      return;
    }
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const sellerSubscription = await apiGet<SellerSubscription>("/api/users/me/seller-subscription");
      setSubscription(sellerSubscription);
      if (sellerSubscription.role !== user.role) {
        updateCurrentUser({ ...user, role: sellerSubscription.role });
      }
      if (!isSellerSubscriptionActive(sellerSubscription)) {
        setOrders([]);
        setDishes([]);
        setFormations([]);
        setLastUpdatedAt(new Date());
        setError("");
        return;
      }

      const [sellerOrders, sellerDishes, sellerFormations, sellerNotifications] = await Promise.all([
        apiGet<Order[]>(`/api/orders/seller/${user.id}`),
        apiGet<Dish[]>(`/api/dishes/seller/${user.id}`),
        apiGet<Formation[]>(`/api/formations/seller/${user.id}`),
        apiGet<SellerNotification[]>("/api/notifications/me"),
      ]);
      const incomingIds = sellerOrders.map((order) => order.id);
      const incomingNewIds = incomingIds.filter((id) => !knownOrderIds.current.has(id));
      if (knownOrderIds.current.size > 0 && incomingNewIds.length > 0) {
        setNewOrderIds(incomingNewIds);
        setMessage(`${incomingNewIds.length} nouvelle commande recue.`);
      }
      knownOrderIds.current = new Set(incomingIds);
      setOrders(sellerOrders);
      setDishes(sellerDishes);
      setFormations(sellerFormations);
      setNotifications(sellerNotifications);
      pushSellerLivePoint(sellerOrders);
      setLastUpdatedAt(new Date());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Synchronisation impossible.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleSubscriptionProofUpload(file?: File) {
    if (!file) {
      setSubscriptionForm({ ...subscriptionForm, proof: "" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSubscriptionForm((current) => ({ ...current, proof: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  async function submitSubscription(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingSubscription) {
      return;
    }
    const sellerD17PhoneNumber = subscriptionForm.sellerD17PhoneNumber || subscription?.sellerD17PhoneNumber || "";
    if (!sellerD17PhoneNumber || !subscriptionForm.reference || !subscriptionForm.proof) {
      setError("Veuillez saisir votre numero D17, la reference D17 et ajouter la capture.");
      return;
    }
    setSubmittingSubscription(true);
    setError("");
    setMessage("");
    try {
      await apiPost("/api/users/me/seller-subscription", {
        ...subscriptionForm,
        sellerD17PhoneNumber,
      });
      const next = await apiGet<SellerSubscription>("/api/users/me/seller-subscription");
      setSubscription(next);
      setSubscriptionForm({ reference: "", proof: "", sellerD17PhoneNumber: "" });
      setMessage("Paiement abonnement envoye. L'admin doit confirmer votre espace vendeur.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi du paiement impossible.");
    } finally {
      setSubmittingSubscription(false);
    }
  }

  useEffect(() => {
    loadData();
    const intervalId = window.setInterval(() => {
      loadData({ silent: true });
    }, 5000);
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => ({
    orders: orders.length,
    revenue: orders.filter((order) => order.sellerPaid).reduce((sum, order) => sum + getSellerOrderTotal(order), 0),
    dishes: dishes.filter((dish) => dish.availability).length,
    formations: formations.filter((formation) => formation.availability).length,
  }), [orders, dishes, formations]);
  function pushSellerLivePoint(nextOrders: Order[]) {
    const point = {
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      commandes: nextOrders.length,
      revenus: Number(nextOrders.filter((order) => order.sellerPaid).reduce((sum, order) => sum + getSellerOrderTotal(order), 0).toFixed(2)),
    };
    setLivePoints((current) => [...current.slice(-11), point]);
  }

  async function updateOrderStatus(orderId: number, status: OrderStatus) {
    setError("");
    setMessage("");
    try {
      await apiPatch(`/api/orders/${orderId}`, { status });
      setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
      setMessage("Statut mis a jour. Le client recevra une notification sur le site.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Statut non modifie.");
    }
  }

  async function markSellerPaid(orderId: number) {
    await apiPatch(`/api/orders/${orderId}/seller-paid`, {});
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, sellerPaid: true } : order));
    setMessage("Paiement vendeur confirme. La somme est ajoutee aux revenus.");
  }

  async function confirmD17Payment(orderId: number) {
    await apiPatch(`/api/orders/${orderId}/confirm-d17`, {});
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, paymentStatus: "SELLER_CONFIRMED", status: "ACCEPTED" } : order));
    setMessage("Paiement D17 confirme. La commande est acceptee.");
  }

  async function saveDish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      ...dishForm,
      price: Number(dishForm.price),
      quantity: Number(dishForm.quantity),
      preparationTime: dishForm.preparationTime ? Number(dishForm.preparationTime) : undefined,
      categoryId: dishForm.categoryId ? Number(dishForm.categoryId) : undefined,
    };
    if (editingDishId) {
      await apiPatch(`/api/dishes/${editingDishId}`, payload);
      setMessage("Plat modifié avec succès.");
    } else {
      await apiPost("/api/dishes", payload);
      setMessage("Plat ajouté avec succès.");
    }
    setDishForm(emptyDish);
    setEditingDishId(null);
    await loadData();
  }

  async function saveFormation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { ...formationForm, price: Number(formationForm.price) };
    if (editingFormationId) {
      await apiPatch(`/api/formations/${editingFormationId}`, payload);
      setMessage("Formation modifiée avec succès.");
    } else {
      await apiPost("/api/formations", payload);
      setMessage("Formation ajoutée avec succès.");
    }
    setFormationForm(emptyFormation);
    setEditingFormationId(null);
    await loadData();
  }

  async function deleteDish(id: number) {
    if (!window.confirm("Supprimer ce plat ?")) return;
    await apiDelete(`/api/dishes/${id}`);
    setMessage("Plat supprimé.");
    await loadData();
  }

  async function deleteFormation(id: number) {
    if (!window.confirm("Supprimer cette formation ?")) return;
    await apiDelete(`/api/formations/${id}`);
    setMessage("Formation supprimée.");
    await loadData();
  }

  function editDish(dish: Dish) {
    setEditingDishId(dish.id);
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: String(dish.price),
      imageUrl: dish.imageUrl ?? "",
      quantity: String(dish.quantity),
      city: dish.city,
      allergens: dish.allergens ?? "",
      preparationTime: dish.preparationTime ? String(dish.preparationTime) : "",
      categoryId: dish.categoryId ? String(dish.categoryId) : "",
      availability: dish.availability,
    });
  }

  function editFormation(formation: Formation) {
    setEditingFormationId(formation.id);
    setFormationForm({
      title: formation.title,
      description: formation.description,
      price: String(formation.price),
      duration: formation.duration ?? "",
      level: formation.level ?? "",
      imageUrl: formation.imageUrl ?? "",
      availability: formation.availability,
    });
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT", "SELLER"]}>
      <main className="page-container">
        {subscription && !isSellerSubscriptionActive(subscription) ? (
          <SubscriptionGate
            subscription={subscription}
            form={subscriptionForm}
            setForm={setSubscriptionForm}
            onUpload={handleSubscriptionProofUpload}
            onSubmit={submitSubscription}
            message={message}
            error={error}
            submitting={submittingSubscription}
          />
        ) : (
        <>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="badge">Espace vendeur</span>
            <h1 className="section-title mt-4">Dashboard vendeur</h1>
            <p className="mt-2 text-stone-600">Gérez vos commandes, plats et formations.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 font-semibold text-green-700">
              <Wifi size={16} />
              Suivi live
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
              {lastUpdatedAt ? `Mis a jour a ${lastUpdatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Synchronisation..."}
            </span>
            <button className="btn-secondary flex items-center gap-2 py-2" onClick={() => loadData({ silent: true })} disabled={refreshing}>
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {[
            ["overview", "Vue d'ensemble"],
            ["orders", "Commandes"],
            ["dishes", "Mes plats"],
            ["formations", "Mes formations"],
          ].map(([value, label]) => (
            <button key={value} onClick={() => setTab(value as Tab)} className={tab === value ? "btn-primary" : "btn-secondary"}>{label}</button>
          ))}
        </div>

        {message ? <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
        {notifications.filter((notification) => !notification.read).length > 0 ? (
          <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-semibold">
                <Bell size={18} />
                {notifications.filter((notification) => !notification.read).length} notification(s) non lue(s)
              </span>
              <button className="btn-secondary py-2" onClick={() => setTab("orders")}>Voir commandes</button>
            </div>
          </div>
        ) : null}
        {error ? <div className="card mb-5 border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}
        {loading ? <div className="card p-8 text-center">Chargement...</div> : null}

        {tab === "overview" ? (
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-4">
            <Stat icon={<ClipboardList />} label="Commandes reçues" value={stats.orders} />
            <Stat icon={<CheckCircle />} label="Revenus payes" value={`${stats.revenue.toFixed(2)} DT`} />
            <Stat icon={<Soup />} label="Plats actifs" value={stats.dishes} />
            <Stat icon={<GraduationCap />} label="Formations actives" value={stats.formations} />
            </div>
            <LiveChart title="Courbe live vendeur" data={livePoints} />
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="card overflow-x-auto p-4">
            <table className="w-full min-w-[1450px] text-left text-sm">
              <thead className="text-stone-500"><tr><th className="p-3">Client</th><th className="p-3">Contact</th><th className="p-3">Adresse livraison</th><th className="p-3">Articles</th><th className="p-3">Total vendeur</th><th className="p-3">Paiement client</th><th className="p-3">Statut</th><th className="p-3">Paiement vendeur</th><th className="p-3">Date</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={`border-t border-stone-200 ${newOrderIds.includes(order.id) ? "bg-green-50" : ""}`}>
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{order.customerFirstName} {order.customerLastName}</p>
                        {newOrderIds.includes(order.id) ? <span className="badge">Nouveau</span> : null}
                      </div>
                      {order.client ? <p className="mt-1 text-xs text-stone-500">Compte #{order.client.id}</p> : null}
                    </td>
                    <td className="p-3 align-top">
                      <p>{order.customerPhone || order.client?.phone || "Sans telephone"}</p>
                      <p>{order.customerEmail || order.client?.email}</p>
                    </td>
                    <td className="p-3 align-top">
                      <p>{order.deliveryAddress}</p>
                      <p>{order.deliveryCity}</p>
                      {order.client?.address ? <p className="mt-1 text-xs text-stone-500">Adresse compte: {order.client.address}</p> : null}
                    </td>
                    <td className="p-3 align-top">
                      <div className="space-y-2">
                        {order.items.map((item) => {
                          const name = item.dish?.name ?? item.formation?.title ?? "Article";
                          const type = item.dish ? "Plat" : "Formation";
                          return (
                            <div key={item.id} className="rounded-lg border border-red-800/10 bg-amber-50/60 p-2">
                              <p className="font-semibold">{name}</p>
                              <p className="text-xs text-stone-600">{type} x {item.quantity} - {item.subtotal.toFixed(2)} DT</p>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3 align-top font-bold text-red-900">{getSellerOrderTotal(order).toFixed(2)} DT</td>
                    <td className="p-3 align-top">
                      {order.paymentMethod === "D17_TRANSFER" ? (
                        <div className="max-w-xs space-y-2">
                          <span className={order.paymentStatus === "SELLER_CONFIRMED" ? "badge" : "badge-muted"}>
                            {order.paymentStatus === "SELLER_CONFIRMED" ? "D17 confirme" : "D17 a verifier"}
                          </span>
                          <p className="text-xs text-stone-600">Numero: {order.d17PhoneNumber}</p>
                          <p className="text-xs font-semibold text-stone-700">Ref: {order.d17TransferReference}</p>
                          {order.d17TransferProof ? (
                            <a href={order.d17TransferProof} target="_blank" rel="noreferrer" className="font-semibold text-red-900">
                              Voir capture
                            </a>
                          ) : null}
                          {order.paymentStatus !== "SELLER_CONFIRMED" ? (
                            <button className="btn-primary py-2" onClick={() => confirmD17Payment(order.id)}>
                              Confirmer D17
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <span className="badge-muted">Livraison</span>
                      )}
                    </td>
                    <td className="p-3"><select className="input py-2" value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
                    <td className="p-3 align-top">
                      {order.sellerPaid ? (
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-2 font-semibold text-green-700">Paye</span>
                      ) : (
                        <button className="btn-primary py-2" onClick={() => markSellerPaid(order.id)} disabled={order.status !== "DELIVERED"}>
                          {order.status === "DELIVERED" ? "Marquer paye" : "Livrer d'abord"}
                        </button>
                      )}
                    </td>
                    <td className="p-3 align-top">{new Date(order.createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
                {orders.length === 0 ? (
                  <tr>
                    <td className="p-6 text-center text-stone-500" colSpan={9}>Aucune commande pour vos plats ou formations.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === "dishes" ? (
          <CrudSection title="Mes plats" onSubmit={saveDish} submitLabel={editingDishId ? "Modifier le plat" : "Ajouter le plat"}>
            <DishForm form={dishForm} setForm={setDishForm} />
            <ItemGrid items={dishes} onEdit={editDish} onDelete={deleteDish} titleKey="name" />
          </CrudSection>
        ) : null}

        {tab === "formations" ? (
          <CrudSection title="Mes formations" onSubmit={saveFormation} submitLabel={editingFormationId ? "Modifier la formation" : "Ajouter la formation"}>
            <FormationForm form={formationForm} setForm={setFormationForm} />
            <ItemGrid items={formations} onEdit={editFormation} onDelete={deleteFormation} titleKey="title" />
          </CrudSection>
        ) : null}
        </>
        )}
      </main>
    </ProtectedRoute>
  );
}

function isSellerSubscriptionActive(subscription: SellerSubscription | null) {
  if (!subscription || subscription.sellerSubscriptionStatus !== "ACTIVE") {
    return false;
  }
  if (!subscription.sellerSubscriptionExpiresAt) {
    return false;
  }
  return new Date(subscription.sellerSubscriptionExpiresAt).getTime() > Date.now();
}

function SubscriptionGate({
  subscription,
  form,
  setForm,
  onUpload,
  onSubmit,
  message,
  error,
  submitting,
}: {
  subscription: SellerSubscription;
  form: { reference: string; proof: string; sellerD17PhoneNumber: string };
  setForm: (value: { reference: string; proof: string; sellerD17PhoneNumber: string }) => void;
  onUpload: (file?: File) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  error: string;
  submitting: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card p-8 animate-slide-up">
        <span className="badge">Abonnement vendeur</span>
        <h1 className="mt-4 text-3xl font-extrabold">Activez votre espace vendeur</h1>
        <p className="mt-3 text-stone-600">
          Pour publier vos plats et formations, payez {subscription.amount.toFixed(2)} DT par mois via D17.
        </p>
        {subscription.sellerSubscriptionStatus === "PENDING" ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
            Votre paiement est envoye. Attendez la confirmation de l'admin.
          </div>
        ) : null}
        {message ? <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
        {error ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <div className="rounded-lg border border-red-800/20 bg-amber-50 p-4">
            <p className="text-sm text-stone-700">Envoyez le montant au numero D17 :</p>
            <p className="mt-2 rounded-lg bg-white p-3 text-2xl font-extrabold text-red-900">{subscription.d17PhoneNumber}</p>
          </div>
          <input
            className="input"
            placeholder="Votre numero D17 vendeur"
            value={form.sellerD17PhoneNumber || subscription.sellerD17PhoneNumber || ""}
            onChange={(e) => setForm({ ...form, sellerD17PhoneNumber: e.target.value })}
          />
          <input className="input" placeholder="Reference / ID du transfert D17" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          <label className="text-sm font-semibold text-stone-700">
            Capture du transfert
            <input className="input mt-2" type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} />
          </label>
          {form.proof ? <img src={form.proof} alt="Preuve abonnement D17" className="h-40 rounded-lg object-cover" /> : null}
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Envoi..." : "Envoyer pour confirmation"}
          </button>
        </form>
      </div>
    </div>
  );
}

function getSellerOrderTotal(order: Order) {
  return order.sellerSubtotal ?? order.items.reduce((sum, item) => sum + item.subtotal, 0);
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="card p-6 animate-slide-up"><div className="mb-4 inline-flex rounded-lg bg-amber-50 p-3 text-red-900">{icon}</div><p className="text-sm text-stone-500">{label}</p><h2 className="mt-2 text-3xl font-extrabold">{value}</h2></div>;
}

function LiveChart({ title, data }: { title: string; data: LivePoint[] }) {
  return (
    <div className="card p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">{title}</h2>
          <p className="text-sm text-stone-500">Mise a jour automatique toutes les 5 secondes.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold uppercase text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Live
        </span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#78716c" }} />
            <YAxis tick={{ fontSize: 12, fill: "#78716c" }} width={42} />
            <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#fed7aa" }} />
            <Line type="monotone" dataKey="commandes" name="Commandes" stroke="#991b1b" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="revenus" name="Revenus DT" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CrudSection({ title, onSubmit, submitLabel, children }: { title: string; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; submitLabel: string; children: React.ReactNode }) {
  const childArray = Array.isArray(children) ? children : [children];
  return <div className="grid gap-6 lg:grid-cols-[420px_1fr]"><form onSubmit={onSubmit} className="card h-fit p-6"><h2 className="mb-5 flex items-center gap-2 text-2xl font-bold"><Plus size={20} /> {title}</h2>{childArray[0]}<button className="btn-primary mt-5 w-full">{submitLabel}</button></form><div>{childArray[1]}</div></div>;
}

function DishForm({ form, setForm }: { form: typeof emptyDish; setForm: (value: typeof emptyDish) => void }) {
  return <div className="grid gap-3"><input className="input" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><input className="input" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><input className="input" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /><input className="input" placeholder="Quantité" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /><input className="input" placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /><input className="input" placeholder="Allergènes" value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} /><input className="input" placeholder="Temps de préparation (min)" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} /><input className="input" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} /><label className="flex gap-2 text-sm"><input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} /> Disponible</label></div>;
}

function FormationForm({ form, setForm }: { form: typeof emptyFormation; setForm: (value: typeof emptyFormation) => void }) {
  return <div className="grid gap-3"><input className="input" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><input className="input" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><input className="input" placeholder="Durée" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /><input className="input" placeholder="Niveau" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} /><input className="input" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /><label className="flex gap-2 text-sm"><input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} /> Disponible</label></div>;
}

function ItemGrid<T extends { id: number; description: string; price: number; availability: boolean }>({ items, onEdit, onDelete, titleKey }: { items: T[]; onEdit: (item: T) => void; onDelete: (id: number) => void; titleKey: keyof T }) {
  return <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <div key={item.id} className="card p-5"><div className="flex items-start justify-between gap-3"><div><span className={item.availability ? "badge" : "badge-muted"}>{item.availability ? "Actif" : "Inactif"}</span><h3 className="mt-3 text-xl font-bold">{String(item[titleKey])}</h3><p className="mt-2 line-clamp-2 text-sm text-stone-600">{item.description}</p><p className="mt-3 font-extrabold text-red-900">{item.price} DT</p></div></div><div className="mt-5 flex gap-2"><button className="btn-secondary py-2" onClick={() => onEdit(item)}>Modifier</button><button className="btn-danger flex items-center gap-2" onClick={() => onDelete(item.id)}><Trash2 size={16} />Supprimer</button></div></div>)}</div>;
}
