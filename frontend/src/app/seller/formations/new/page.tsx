"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiPost } from "@/lib/api";

type FormationFormState = {
  title: string;
  description: string;
  price: string;
  duration: string;
  level: string;
  imageUrl: string;
  availability: boolean;
};

const emptyFormation: FormationFormState = {
  title: "",
  description: "",
  price: "",
  duration: "",
  level: "",
  imageUrl: "",
  availability: true,
};

export default function SellerFormationCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormationFormState>(emptyFormation);
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
      await apiPost("/api/formations", {
        ...form,
        price: Number(form.price),
      });
      setMessage("Formation ajoutee avec succes.");
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
              <span className="badge">Nouvelle formation</span>
              <h1 className="section-title mt-4">Ajouter une formation</h1>
              <p className="mt-2 text-stone-600">Créez une nouvelle formation avec sa photo et ses informations.</p>
            </div>
            <Link href="/seller/dashboard" className="btn-secondary">
              Retour au dashboard
            </Link>
          </div>

          {message ? <div className="card mb-5 border-green-200 bg-green-50 p-4 text-green-800">{message}</div> : null}
          {error ? <div className="card mb-5 border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

          <form onSubmit={handleSubmit} className="card grid gap-4 p-6">
            <input className="input" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="input min-h-32" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input className="input" placeholder="Durée" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <input className="input" placeholder="Niveau" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-stone-700">
                Photo de la formation
                <input className="input mt-2" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
              </label>
              <input className="input" placeholder="Ou coller une URL image" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              {form.imageUrl ? <img src={form.imageUrl} alt="Apercu de la formation" className="h-52 w-full rounded-2xl object-cover" /> : null}
            </div>
            <label className="flex gap-2 text-sm">
              <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
              Disponible
            </label>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Enregistrement..." : "Ajouter la formation"}
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
