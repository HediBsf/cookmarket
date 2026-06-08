"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiPost } from "@/lib/api";

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

export default function SellerDishCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<DishFormState>(emptyDish);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      await apiPost("/api/dishes", {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        preparationTime: form.preparationTime ? Number(form.preparationTime) : undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      });
      setMessage("Plat ajoute avec succes.");
      window.setTimeout(() => {
        router.push("/seller/dashboard");
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ajout impossible.");
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
              <span className="badge">Nouveau plat</span>
              <h1 className="section-title mt-4">Ajouter un plat</h1>
              <p className="mt-2 text-stone-600">Créez un nouveau plat avec sa photo et ses informations.</p>
            </div>
            <Link href="/seller/dashboard" className="btn-secondary">
              Retour au dashboard
            </Link>
          </div>

          {message ? <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
          {error ? <div className="card mb-5 border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

          <form onSubmit={handleSubmit} className="card grid gap-4 p-6">
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
                {saving ? "Enregistrement..." : "Ajouter le plat"}
              </button>
              <Link href="/seller/dashboard" className="btn-secondary">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  );
}
