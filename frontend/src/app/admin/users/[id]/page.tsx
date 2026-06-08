"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet, apiPatch } from "@/lib/api";

type Role = "CLIENT" | "SELLER" | "ADMIN";

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
};

type UserFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
};

const emptyUser: UserFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
};

export default function AdminUserEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<UserFormState>(emptyUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const users = await apiGet<User[]>("/api/admin/users");
        const user = users.find((item) => item.id === Number(params.id));
        if (!user) {
          setError("Utilisateur introuvable.");
          return;
        }
        setForm({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
          city: user.city || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await apiPatch(`/api/admin/users/${params.id}`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
      });
      setMessage("Informations utilisateur mises a jour.");
      window.setTimeout(() => {
        router.push("/admin/dashboard?tab=users");
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Modification impossible.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="page-container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <span className="badge">Edition utilisateur</span>
              <h1 className="section-title mt-4">Modifier un utilisateur</h1>
              <p className="mt-2 text-stone-600">Mettez a jour les informations personnelles du compte.</p>
            </div>
            <Link href="/admin/dashboard" className="btn-secondary">
              Retour au dashboard
            </Link>
          </div>

          {message ? <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
          {error ? <div className="card mb-5 border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

          <form onSubmit={handleSubmit} className="card grid gap-4 p-6">
            {loading ? <div className="text-center text-stone-500">Chargement...</div> : null}
            {!loading ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Prenom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  <input className="input" placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Telephone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input className="input" placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary" type="submit" disabled={saving}>
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                  <Link href="/admin/dashboard" className="btn-secondary">
                    Annuler
                  </Link>
                </div>
              </>
            ) : null}
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
