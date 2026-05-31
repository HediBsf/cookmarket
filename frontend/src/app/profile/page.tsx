"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { HelpCircle, LogOut, Save, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet, apiPatch, apiPost } from "@/lib/api";
import { logout, updateCurrentUser, UserRole } from "@/lib/auth";

type Profile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
  role: UserRole;
  profileImageUrl?: string | null;
  createdAt?: string;
};

type SupportTicket = {
  id: number;
  subject: string;
  message: string;
  reply?: string | null;
  status: string;
  createdAt: string;
  repliedAt?: string | null;
  repliedBy?: { firstName: string; lastName: string } | null;
};

const roleLabels: Record<UserRole, string> = {
  CLIENT: "Client",
  SELLER: "Vendeur",
  ADMIN: "Admin",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: "",
    profileImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [supportSending, setSupportSending] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });
  const [supportMessage, setSupportMessage] = useState("");
  const [supportError, setSupportError] = useState("");
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<Profile>("/api/users/me"),
      apiGet<SupportTicket[]>("/api/users/me/support"),
    ])
      .then(([data, tickets]) => {
        setProfile(data);
        setSupportTickets(tickets);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          city: data.city || "",
          address: data.address || "",
          profileImageUrl: data.profileImageUrl || "",
        });
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Chargement impossible.";
        if (message.toLowerCase().includes("token")) {
          logout();
          router.replace("/login");
          return;
        }
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("profileImageUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updated = await apiPatch<Profile>("/api/users/me", form);
      setProfile(updated);
      updateCurrentUser({
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        role: updated.role,
        profileImageUrl: updated.profileImageUrl,
      });
      setMessage("Profil mis a jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sauvegarde impossible.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  async function handleSupportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupportSending(true);
    setSupportMessage("");
    setSupportError("");

    try {
      const response = await apiPost<{ message: string }>("/api/users/me/support", supportForm);
      setSupportMessage(response.message);
      setSupportForm({ subject: "", message: "" });
      const tickets = await apiGet<SupportTicket[]>("/api/users/me/support");
      setSupportTickets(tickets);
    } catch (err) {
      setSupportError(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setSupportSending(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <div className="mb-8">
          <span className="badge">Compte</span>
          <h1 className="section-title mt-4">Profil et parametres</h1>
          <p className="mt-2 max-w-2xl text-stone-600">
            Gere tes coordonnees, ta photo et les informations de ton compte.
          </p>
        </div>

        {loading ? <div className="card p-8 text-center">Chargement du profil...</div> : null}
        {error ? <div className="card mb-6 p-5 text-red-700">{error}</div> : null}

        {profile ? (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-6">
              <section className="card p-6">
                <div className="flex flex-col items-center text-center">
                  {form.profileImageUrl ? (
                    <img
                      src={form.profileImageUrl}
                      alt="Photo de profil"
                      className="h-32 w-32 rounded-full border-4 border-amber-100 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-amber-100 bg-amber-50 text-red-900 shadow-lg">
                      <UserCircle size={72} />
                    </div>
                  )}
                  <h2 className="mt-5 text-2xl font-extrabold text-stone-950">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-stone-600">{profile.email}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="badge">{roleLabels[profile.role]}</span>
                    <span className="badge-muted">ID #{profile.id}</span>
                  </div>
                </div>
              </section>

              <section className="card p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <HelpCircle size={20} /> Aide
                </h2>
                <p className="mt-3 text-sm text-stone-600">
                  Ton ID utilisateur #{profile.id} sera envoye automatiquement avec ta demande.
                </p>
                <form onSubmit={handleSupportSubmit} className="mt-5 space-y-3">
                  <input
                    className="input"
                    placeholder="Sujet"
                    value={supportForm.subject}
                    onChange={(event) => setSupportForm((current) => ({ ...current, subject: event.target.value }))}
                  />
                  <textarea
                    className="input min-h-28 resize-y"
                    placeholder="Explique ton probleme..."
                    value={supportForm.message}
                    onChange={(event) => setSupportForm((current) => ({ ...current, message: event.target.value }))}
                  />
                  {supportMessage ? <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{supportMessage}</div> : null}
                  {supportError ? <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{supportError}</div> : null}
                  <button className="btn-secondary w-full" disabled={supportSending}>
                    {supportSending ? "Envoi..." : "Contacter l'aide"}
                  </button>
                </form>
              </section>

              <section className="card p-6">
                <h2 className="text-xl font-bold">Mes demandes</h2>
                <div className="mt-4 grid gap-3">
                  {supportTickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-stone-950">#{ticket.id} {ticket.subject}</p>
                        <span className={ticket.status === "ANSWERED" ? "badge" : "badge-muted"}>
                          {ticket.status === "ANSWERED" ? "Repondu" : "Ouvert"}
                        </span>
                      </div>
                      <p className="mt-2 text-stone-600 whitespace-pre-wrap">{ticket.message}</p>
                      {ticket.reply ? (
                        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-green-900">
                          <p className="font-bold">Reponse admin</p>
                          <p className="mt-1 whitespace-pre-wrap">{ticket.reply}</p>
                          <p className="mt-2 text-xs text-green-700">
                            {ticket.repliedAt ? new Date(ticket.repliedAt).toLocaleString("fr-FR") : ""}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                  {supportTickets.length === 0 ? <p className="text-sm text-stone-500">Aucune demande envoyee.</p> : null}
                </div>
              </section>

              <button className="btn-danger flex w-full items-center gap-2" onClick={handleLogout}>
                <LogOut size={18} /> Deconnexion
              </button>
            </aside>

            <form onSubmit={handleSubmit} className="card p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Prenom</span>
                  <input className="input" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Nom</span>
                  <input className="input" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Email</span>
                  <input className="input bg-stone-100" value={profile.email} disabled />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Telephone</span>
                  <input className="input" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Ville</span>
                  <input className="input" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Photo depuis ordinateur</span>
                  <input className="input" type="file" accept="image/*" onChange={handlePhoto} />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Adresse</span>
                  <input className="input" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-stone-700">Lien photo de profil</span>
                  <input className="input" value={form.profileImageUrl} onChange={(event) => updateField("profileImageUrl", event.target.value)} />
                </label>
              </div>

              {message ? <div className="mt-5 rounded-lg bg-emerald-50 p-4 font-semibold text-emerald-700">{message}</div> : null}

              <button className="btn-primary mt-6 flex items-center gap-2" disabled={saving}>
                <Save size={18} /> {saving ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </form>
          </div>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
