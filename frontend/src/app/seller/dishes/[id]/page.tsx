"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet, apiPatch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  city: string;
  allergens?: string | null;
  preparationTime?: number | null;
  categoryId?: number | null;
  availability: boolean;
  seller?: { id: number } | null;
};

type DishFormState = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  quantity: string;
  city: string;
  allergens: string;
  preparationTime: string;
  categoryId: string;
  availability: boolean;
};

const emptyDish: DishFormState = {
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

export default function SellerDishEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = getCurrentUser();
  const [form, setForm] = useState<DishFormState>(emptyDish);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDish() {
      try {
        const dish = await apiGet<Dish>(`/api/dishes/${params.id}`);
        if (user && dish.seller?.id && dish.seller.id !== user.id) {
          setError("Vous ne pouvez pas modifier ce plat.");
          return;
        }
        setForm({
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    }

    loadDish();
  }, [params.id, user]);

  function handleImageUpload(file?: File) {
    if (!file) {
      setForm((current) => ({ ...current, imageUrl: "" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, imageUrl: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await apiPatch(`/api/dishes/${params.id}`, {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        preparationTime: form.preparationTime ? Number(form.preparationTime) : undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      });
      setMessage("Plat modifie avec succes.");
      window.setTimeout(() => {
        router.push("/seller/dashboard");
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Modification impossible.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["SELLER"]}>
      <main className="page-container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <span className="badge">Edition du plat</span>
              <h1 className="section-title mt-4">Modifier le plat</h1>
              <p className="mt-2 text-stone-600">Mettez a jour les informations et la photo de votre plat.</p>
            </div>
            <Link href="/seller/dashboard" className="btn-secondary">
              Retour au dashboard
            </Link>
          </div>

          {message ? <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
          {error ? <div className="card mb-5 border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

          <form onSubmit={handleSubmit} className="card grid gap-4 p-6">
            {loading ? <div className="text-center text-stone-500">Chargement...</div> : null}
            {!loading ? (
              <>
                <input className="input" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <textarea className="input min-h-32" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  <input className="input" placeholder="Quantite" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-stone-700">
                    Photo du plat
                    <input className="input mt-2" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                  </label>
                  <input className="input" placeholder="Ou coller une URL image" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  {form.imageUrl ? <img src={form.imageUrl} alt="Apercu du plat" className="h-52 w-full rounded-2xl object-cover" /> : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input className="input" placeholder="Allergenes" value={form.allergens} onChange={(e) => setForm({ ...form, allergens: e.target.value })} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Temps de preparation (min)" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} />
                  <input className="input" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} />
                </div>
                <label className="flex gap-2 text-sm">
                  <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
                  Disponible
                </label>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary" type="submit" disabled={saving}>
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                  <Link href="/seller/dashboard" className="btn-secondary">
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
