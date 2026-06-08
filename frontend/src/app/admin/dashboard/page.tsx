"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, CheckCircle, ClipboardList, GraduationCap, RefreshCw, Soup, Trash2, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiDelete, apiGet, apiPatch } from "@/lib/api";

type Tab = "overview" | "users" | "orders" | "dishes" | "formations" | "recipes" | "support";
type Role = "CLIENT" | "SELLER" | "ADMIN";

type Overview = {
  users: number;
  orders: number;
  dishes: number;
  formations: number;
  revenue: number;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  role: Role;
  emailVerified: boolean;
  sellerSubscriptionStatus?: string | null;
  sellerSubscriptionExpiresAt?: string | null;
  sellerSubscriptionReference?: string | null;
  sellerSubscriptionProof?: string | null;
  sellerD17PhoneNumber?: string | null;
  createdAt: string;
};

type Order = {
  id: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  client?: { firstName: string; lastName: string; email: string } | null;
  items: Array<{ id: number; quantity: number; subtotal: number; dish?: { name: string } | null; formation?: { title: string } | null }>;
};

type Dish = {
  id: number;
  name: string;
  price: number;
  city: string;
  availability: boolean;
  imageUrl?: string | null;
  seller?: { firstName: string; lastName: string; email: string };
};

type Formation = {
  id: number;
  title: string;
  price: number;
  level?: string | null;
  availability: boolean;
  imageUrl?: string | null;
  seller?: { firstName: string; lastName: string; email: string };
};

type Recipe = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  difficulty?: string | null;
  preparationTime?: number | null;
  cookingTime?: number | null;
  category?: { id: number; name: string; type: string } | null;
};

type LivePoint = {
  time: string;
  commandes: number;
  revenus: number;
};

type AdminNotification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type SupportTicket = {
  id: number;
  subject: string;
  message: string;
  reply?: string | null;
  status: string;
  readByAdmin: boolean;
  createdAt: string;
  repliedAt?: string | null;
  user: { id: number; firstName: string; lastName: string; email: string; phone?: string | null; city?: string | null; role: Role };
  repliedBy?: { firstName: string; lastName: string; email: string } | null;
};

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [supportReplies, setSupportReplies] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [livePoints, setLivePoints] = useState<LivePoint[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [dishSearch, setDishSearch] = useState("");
  const [formationSearch, setFormationSearch] = useState("");

  async function loadData(options: { silent?: boolean } = {}) {
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const [overviewData, usersData, ordersData, dishesData, formationsData, recipesData, notificationsData, supportData] = await Promise.all([
        apiGet<Overview>("/api/admin/overview"),
        apiGet<User[]>("/api/admin/users"),
        apiGet<Order[]>("/api/admin/orders"),
        apiGet<Dish[]>("/api/admin/dishes"),
        apiGet<Formation[]>("/api/admin/formations"),
        apiGet<Recipe[]>("/api/recipes"),
        apiGet<AdminNotification[]>("/api/notifications/me"),
        apiGet<SupportTicket[]>("/api/admin/support"),
      ]);
      setOverview(overviewData);
      setUsers(usersData);
      setOrders(ordersData);
      setDishes(dishesData);
      setFormations(formationsData);
      setRecipes(recipesData);
      setNotifications(notificationsData);
      setSupportTickets(supportData);
      setLastUpdatedAt(new Date());
      pushAdminLivePoint(overviewData);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement admin impossible.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
    const intervalId = window.setInterval(() => {
      loadData({ silent: true });
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab === "overview" || requestedTab === "users" || requestedTab === "orders" || requestedTab === "dishes" || requestedTab === "formations" || requestedTab === "recipes" || requestedTab === "support") {
      setTab(requestedTab);
    }
  }, []);

  const tabs = useMemo(() => [
    ["overview", "Vue globale"],
    ["users", "Utilisateurs"],
    ["orders", "Commandes"],
    ["dishes", "Plats"],
    ["formations", "Formations"],
    ["recipes", "Recettes"],
    ["support", "Aide"],
  ] as Array<[Tab, string]>, []);

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read),
    [notifications],
  );
  const pendingSellerRequests = useMemo(
    () => users.filter((user) => user.sellerSubscriptionStatus === "PENDING"),
    [users],
  );
  const openSupportTickets = useMemo(
    () => supportTickets.filter((ticket) => ticket.status !== "ANSWERED"),
    [supportTickets],
  );
  const userNameOptions = useMemo(
    () =>
      Array.from(
        new Set(users.map((user) => `${user.firstName} ${user.lastName}`.trim()).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [users],
  );
  const filteredUsers = useMemo(() => {
    const search = userSearch.trim().toLowerCase();
    return users.filter((user) => {
      const haystack = [
        user.firstName,
        user.lastName,
        `${user.firstName} ${user.lastName}`,
        user.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return !search || haystack.includes(search);
    });
  }, [users, userSearch]);
  const orderClientOptions = useMemo(
    () =>
      Array.from(
        new Set(
          orders
            .map((order) => `${order.client?.firstName ?? ""} ${order.client?.lastName ?? ""}`.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [orders],
  );
  const dishSellerOptions = useMemo(
    () =>
      Array.from(
        new Set(
          dishes
            .map((dish) => `${dish.seller?.firstName ?? ""} ${dish.seller?.lastName ?? ""}`.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [dishes],
  );
  const formationSellerOptions = useMemo(
    () =>
      Array.from(
        new Set(
          formations
            .map((formation) => `${formation.seller?.firstName ?? ""} ${formation.seller?.lastName ?? ""}`.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [formations],
  );
  const filteredOrders = useMemo(() => {
    const search = orderSearch.trim().toLowerCase();
    return orders.filter((order) => {
      const clientName = `${order.client?.firstName ?? ""} ${order.client?.lastName ?? ""}`.trim();
      const haystack = [
        `commande ${order.id}`,
        clientName,
        order.client?.firstName,
        order.client?.lastName,
        order.client?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      return matchesSearch;
    });
  }, [orders, orderSearch]);
  const filteredDishes = useMemo(() => {
    const search = dishSearch.trim().toLowerCase();
    return dishes.filter((dish) => {
      const haystack = [
        dish.name,
        dish.city,
        dish.seller?.firstName,
        dish.seller?.lastName,
        dish.seller?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      return matchesSearch;
    });
  }, [dishes, dishSearch]);
  const filteredFormations = useMemo(() => {
    const search = formationSearch.trim().toLowerCase();
    return formations.filter((formation) => {
      const haystack = [
        formation.title,
        formation.level,
        formation.seller?.firstName,
        formation.seller?.lastName,
        formation.seller?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      return matchesSearch;
    });
  }, [formations, formationSearch]);

  function pushAdminLivePoint(nextOverview: Overview) {
    const point = {
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      commandes: nextOverview.orders,
      revenus: Number(nextOverview.revenue.toFixed(2)),
    };
    setLivePoints((current) => [...current.slice(-11), point]);
  }

  async function confirmSellerSubscription(userId: number) {
    const updated = await apiPatch<Pick<User, "id" | "role" | "sellerSubscriptionStatus" | "sellerSubscriptionExpiresAt">>(
      `/api/admin/users/${userId}/confirm-seller-subscription`,
      {},
    );
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, ...updated } : user));
    setMessage("Abonnement vendeur confirme pour 1 mois.");
  }

  async function markNotificationRead(id: number) {
    await apiPatch(`/api/notifications/${id}/read`, {});
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  }

  async function replySupportTicket(id: number) {
    const reply = supportReplies[id]?.trim();
    if (!reply) {
      setError("Reponse obligatoire.");
      return;
    }
    const updated = await apiPatch<SupportTicket>(`/api/admin/support/${id}/reply`, { reply });
    setSupportTickets((current) => current.map((ticket) => ticket.id === id ? updated : ticket));
    setSupportReplies((current) => ({ ...current, [id]: "" }));
    setMessage("Reponse envoyee sur le site.");
    setError("");
  }

  async function remove(path: string, onDone: () => void) {
    await apiDelete(path);
    onDone();
    setMessage("Element supprime.");
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="page-container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="badge">Administration</span>
            <h1 className="section-title mt-4">Espace admin</h1>
            <p className="mt-2 text-stone-600">Controle global des comptes, commandes, plats, formations et recettes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600">
              {lastUpdatedAt ? `Mis a jour a ${lastUpdatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Synchronisation..."}
            </span>
          <button className="btn-secondary flex items-center gap-2" onClick={() => loadData({ silent: true })} disabled={refreshing}>
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            Actualiser
          </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map(([value, label]) => (
            <button key={value} className={tab === value ? "btn-primary" : "btn-secondary"} onClick={() => setTab(value)}>
              {label}
            </button>
          ))}
        </div>

        {message ? <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
        {error ? <div className="card mb-5 border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}
        {unreadNotifications.length > 0 ? (
          <div className="card mb-5 border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center gap-2 font-extrabold text-red-900">
              <Bell size={18} />
              {unreadNotifications.length} notification(s) admin non lue(s)
            </div>
            <div className="grid gap-3">
              {unreadNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="rounded-lg border border-amber-200 bg-white p-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="font-bold text-stone-950">{notification.title}</h2>
                      <p className="mt-1 text-sm text-stone-600">{notification.message}</p>
                      <p className="mt-2 text-xs text-stone-400">{new Date(notification.createdAt).toLocaleString("fr-FR")}</p>
                    </div>
                    <button className="btn-secondary py-2" onClick={() => markNotificationRead(notification.id)}>
                      Marquer lue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {pendingSellerRequests.length > 0 ? (
          <div className="card mb-5 border-red-200 bg-red-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 font-extrabold text-red-900">
                  <Bell size={18} />
                  {pendingSellerRequests.length} demande(s) vendeur en attente
                </div>
                <p className="mt-1 text-sm text-stone-600">
                  {pendingSellerRequests.slice(0, 3).map((user) => `${user.firstName} ${user.lastName}`).join(", ")}
                </p>
              </div>
              <button className="btn-primary py-2" onClick={() => setTab("users")}>
                Voir demandes
              </button>
            </div>
          </div>
        ) : null}
        {openSupportTickets.length > 0 ? (
          <div className="card mb-5 border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 font-extrabold text-red-900">
                  <Bell size={18} />
                  {openSupportTickets.length} demande(s) d'aide en attente
                </div>
                <p className="mt-1 text-sm text-stone-600">
                  {openSupportTickets.slice(0, 3).map((ticket) => `#${ticket.id} ${ticket.subject}`).join(", ")}
                </p>
              </div>
              <button className="btn-primary py-2" onClick={() => setTab("support")}>
                Repondre
              </button>
            </div>
          </div>
        ) : null}
        {loading ? <div className="card p-8 text-center">Chargement admin...</div> : null}

        {!loading && tab === "overview" && overview ? (
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-5">
              <Stat icon={<Users />} label="Utilisateurs" value={overview.users} />
              <Stat icon={<ClipboardList />} label="Commandes" value={overview.orders} />
              <Stat icon={<Soup />} label="Plats" value={overview.dishes} />
              <Stat icon={<GraduationCap />} label="Formations" value={overview.formations} />
              <Stat icon={<CheckCircle />} label="Revenus" value={`${overview.revenue.toFixed(2)} DT`} />
            </div>
            <LiveChart title="Courbe live admin" data={livePoints} />
          </div>
        ) : null}

        {!loading && tab === "users" ? (
          <div className="grid gap-4">
            <FilterInput
              value={userSearch}
              placeholder="Rechercher ou choisir un utilisateur..."
              onChange={setUserSearch}
              options={userNameOptions}
              listId="user-name-options"
            />
            <div className="card overflow-x-auto p-4">
            <table className="w-full min-w-[1250px] text-left text-sm">
              <thead className="text-stone-500"><tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Contact</th><th className="p-3">Role</th><th className="p-3">Verification</th><th className="p-3">Abonnement vendeur</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-stone-200">
                    <td className="p-3 font-semibold">{user.firstName} {user.lastName}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone || "-"}<br />{user.city || ""}</td>
                    <td className="p-3"><span className="badge-muted">{user.role}</span></td>
                    <td className="p-3">{user.emailVerified ? <span className="badge">Verifie</span> : <span className="badge-muted">Non verifie</span>}</td>
                    <td className="p-3">
                      <div className="max-w-xs space-y-2">
                        <span className={user.sellerSubscriptionStatus === "ACTIVE" ? "badge" : user.sellerSubscriptionStatus === "PENDING" ? "badge-muted" : "rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-bold uppercase text-stone-500"}>
                          {user.sellerSubscriptionStatus || "INACTIVE"}
                        </span>
                        {user.sellerD17PhoneNumber ? <p className="text-xs font-semibold text-stone-700">D17 vendeur: {user.sellerD17PhoneNumber}</p> : null}
                        {user.sellerSubscriptionReference ? <p className="text-xs font-semibold text-stone-700">Ref: {user.sellerSubscriptionReference}</p> : null}
                        {user.sellerSubscriptionExpiresAt ? <p className="text-xs text-stone-600">Expire: {new Date(user.sellerSubscriptionExpiresAt).toLocaleDateString("fr-FR")}</p> : null}
                        {user.sellerSubscriptionProof ? (
                          <a href={user.sellerSubscriptionProof} target="_blank" rel="noreferrer" className="text-xs font-bold text-red-900">
                            Voir capture D17
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/users/${user.id}`} className="btn-secondary py-2">
                          Modifier
                        </Link>
                        {user.sellerSubscriptionStatus === "PENDING" ? (
                          <button className="btn-primary py-2" onClick={() => confirmSellerSubscription(user.id)}>
                            Confirmer abonnement
                          </button>
                        ) : null}
                        <button className="btn-danger flex items-center gap-2" onClick={() => remove(`/api/admin/users/${user.id}`, () => setUsers((current) => current.filter((item) => item.id !== user.id)))}>
                          <Trash2 size={16} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        ) : null}

        {!loading && tab === "orders" ? (
          <div className="grid gap-4">
            <FilterInput
              value={orderSearch}
              placeholder="Rechercher ou choisir un client..."
              onChange={setOrderSearch}
              options={orderClientOptions}
              listId="order-client-options"
            />
            <AdminList items={filteredOrders.map((order) => ({
              id: order.id,
              title: `Commande #${order.id}`,
              meta: `${order.client?.firstName ?? ""} ${order.client?.lastName ?? ""} - ${order.totalPrice.toFixed(2)} DT - ${order.status}`,
              sub: `${order.paymentMethod} / ${order.paymentStatus}`,
            }))} onDelete={(id) => remove(`/api/admin/orders/${id}`, () => setOrders((current) => current.filter((item) => item.id !== id)))} />
          </div>
        ) : null}

        {!loading && tab === "dishes" ? (
          <div className="grid gap-4">
            <FilterInput
              value={dishSearch}
              placeholder="Rechercher ou choisir un vendeur..."
              onChange={setDishSearch}
              options={dishSellerOptions}
              listId="dish-seller-options"
            />
            <AdminList items={filteredDishes.map((dish) => ({
              id: dish.id,
              title: dish.name,
              meta: `${dish.price.toFixed(2)} DT - ${dish.city}`,
              sub: `Vendeur: ${dish.seller?.firstName ?? ""} ${dish.seller?.lastName ?? ""}`,
              imageUrl: dish.imageUrl,
            }))} onDelete={(id) => remove(`/api/admin/dishes/${id}`, () => setDishes((current) => current.filter((item) => item.id !== id)))} />
          </div>
        ) : null}

        {!loading && tab === "formations" ? (
          <div className="grid gap-4">
            <FilterInput
              value={formationSearch}
              placeholder="Rechercher ou choisir un vendeur..."
              onChange={setFormationSearch}
              options={formationSellerOptions}
              listId="formation-seller-options"
            />
            <AdminList items={filteredFormations.map((formation) => ({
              id: formation.id,
              title: formation.title,
              meta: `${formation.price.toFixed(2)} DT - ${formation.level || "Niveau libre"}`,
              sub: `Vendeur: ${formation.seller?.firstName ?? ""} ${formation.seller?.lastName ?? ""}`,
              imageUrl: formation.imageUrl,
            }))} onDelete={(id) => remove(`/api/admin/formations/${id}`, () => setFormations((current) => current.filter((item) => item.id !== id)))} />
          </div>
        ) : null}

        {!loading && tab === "recipes" ? (
          <div className="grid gap-4">
            <div className="flex justify-end">
              <Link href="/admin/recipes/new" className="btn-primary flex items-center gap-2">
                <BookOpen size={18} />
                Ajouter une recette
              </Link>
            </div>
            <AdminList
              items={recipes.map((recipe) => ({
                id: recipe.id,
                title: recipe.title,
                meta: `${recipe.difficulty || "Difficulte libre"} - ${recipe.preparationTime || 0} min`,
                sub: recipe.category?.name || "Sans categorie",
                imageUrl: recipe.imageUrl,
              }))}
              getEditHref={(id) => `/admin/recipes/${id}`}
              onDelete={(id) => remove(`/api/recipes/${id}`, () => setRecipes((current) => current.filter((item) => item.id !== id)))}
            />
          </div>
        ) : null}

        {!loading && tab === "support" ? (
          <div className="grid gap-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="card p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold">#{ticket.id} {ticket.subject}</h2>
                      <span className={ticket.status === "ANSWERED" ? "badge" : "badge-muted"}>
                        {ticket.status === "ANSWERED" ? "Repondu" : "Ouvert"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-stone-700">
                      {ticket.user.firstName} {ticket.user.lastName} - {ticket.user.role} - {ticket.user.email}
                    </p>
                    <p className="text-sm text-stone-500">
                      {ticket.user.phone || "-"} {ticket.user.city ? `- ${ticket.user.city}` : ""} - {new Date(ticket.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-800 whitespace-pre-wrap">
                  {ticket.message}
                </div>
                {ticket.reply ? (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                    <p className="font-bold">Reponse admin</p>
                    <p className="mt-2 whitespace-pre-wrap">{ticket.reply}</p>
                    <p className="mt-2 text-xs text-green-700">
                      {ticket.repliedAt ? new Date(ticket.repliedAt).toLocaleString("fr-FR") : ""}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    <textarea
                      className="input min-h-28 resize-y"
                      placeholder="Reponse a envoyer sur le site..."
                      value={supportReplies[ticket.id] || ""}
                      onChange={(event) => setSupportReplies((current) => ({ ...current, [ticket.id]: event.target.value }))}
                    />
                    <button className="btn-primary w-fit" onClick={() => replySupportTicket(ticket.id)}>
                      Envoyer la reponse
                    </button>
                  </div>
                )}
              </div>
            ))}
            {supportTickets.length === 0 ? <div className="card p-8 text-center text-stone-600">Aucune demande d'aide.</div> : null}
          </div>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="card p-5"><div className="mb-3 inline-flex rounded-lg bg-amber-50 p-3 text-red-900">{icon}</div><p className="text-sm text-stone-500">{label}</p><h2 className="mt-2 text-2xl font-extrabold">{value}</h2></div>;
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

function FilterInput({
  value,
  placeholder,
  onChange,
  options,
  listId,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  options: string[];
  listId: string;
}) {
  const [focused, setFocused] = useState(false);
  const filteredOptions = options.filter((option) =>
    !value.trim() ? true : option.toLowerCase().includes(value.trim().toLowerCase()),
  );

  return (
    <div className="card p-4">
      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 150)}
      />
      {focused && filteredOptions.length > 0 ? (
        <div className="mt-3 max-h-56 overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          {filteredOptions.map((option) => (
            <button
              key={`${listId}-${option}`}
              type="button"
              className="block w-full border-b border-stone-100 px-4 py-3 text-left text-sm text-stone-700 last:border-b-0 hover:bg-stone-50"
              onMouseDown={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AdminList({
  items,
  onDelete,
  getEditHref,
}: {
  items: Array<{ id: number; title: string; meta: string; sub: string; imageUrl?: string | null }>;
  onDelete: (id: number) => void;
  getEditHref?: (id: number) => string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="card p-5">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="mb-4 h-48 w-full rounded-2xl object-cover"
            />
          ) : null}
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p className="mt-2 text-sm font-semibold text-red-900">{item.meta}</p>
          <p className="mt-1 text-sm text-stone-600">{item.sub}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {getEditHref ? (
              <Link href={getEditHref(item.id)} className="btn-secondary">
                Modifier
              </Link>
            ) : null}
            <button className="btn-danger flex items-center gap-2" onClick={() => onDelete(item.id)}>
              <Trash2 size={16} /> Supprimer
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 ? <div className="card p-8 text-center text-stone-600 md:col-span-2">Aucun element.</div> : null}
    </div>
  );
}
