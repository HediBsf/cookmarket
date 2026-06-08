"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet, apiPatch } from "@/lib/api";

type Recipe = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  ingredients: string;
  steps: string;
  preparationTime?: number | null;
  cookingTime?: number | null;
  difficulty?: string | null;
  servings?: number | null;
  categoryId?: number | null;
};

type RecipeFormState = {
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string;
  steps: string;
  preparationTime: string;
  cookingTime: string;
  difficulty: string;
  servings: string;
  categoryId: string;
};

const emptyRecipe: RecipeFormState = {
  title: "",
  description: "",
  imageUrl: "",
  ingredients: "",
  steps: "",
  preparationTime: "",
  cookingTime: "",
  difficulty: "",
  servings: "",
  categoryId: "",
};

export default function AdminRecipeEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<RecipeFormState>(emptyRecipe);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        const recipe = await apiGet<Recipe>(`/api/recipes/${params.id}`);
        setForm({
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl ?? "",
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          preparationTime: recipe.preparationTime ? String(recipe.preparationTime) : "",
          cookingTime: recipe.cookingTime ? String(recipe.cookingTime) : "",
          difficulty: recipe.difficulty ?? "",
          servings: recipe.servings ? String(recipe.servings) : "",
          categoryId: recipe.categoryId ? String(recipe.categoryId) : "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [params.id]);

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
      await apiPatch(`/api/recipes/${params.id}`, {
        ...form,
        preparationTime: form.preparationTime ? Number(form.preparationTime) : 0,
        cookingTime: form.cookingTime ? Number(form.cookingTime) : undefined,
        servings: form.servings ? Number(form.servings) : undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      });
      setMessage("Recette modifiee avec succes.");
      window.setTimeout(() => {
        router.push("/admin/dashboard");
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
              <span className="badge">Edition recette</span>
              <h1 className="section-title mt-4">Modifier une recette</h1>
              <p className="mt-2 text-stone-600">Mettez a jour la photo, les ingredients et les etapes de la recette.</p>
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
                <input className="input" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <textarea className="input min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-stone-700">
                    Photo de la recette
                    <input className="input mt-2" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                  </label>
                  <input className="input" placeholder="Ou coller une URL image" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  {form.imageUrl ? <img src={form.imageUrl} alt="Apercu de la recette" className="h-52 w-full rounded-2xl object-cover" /> : null}
                </div>

                <textarea className="input min-h-28" placeholder="Ingredients" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
                <textarea className="input min-h-36" placeholder="Etapes" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} />

                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input" placeholder="Temps de preparation (min)" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} />
                  <input className="input" placeholder="Temps de cuisson (min)" value={form.cookingTime} onChange={(e) => setForm({ ...form, cookingTime: e.target.value })} />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <input className="input" placeholder="Difficulte" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
                  <input className="input" placeholder="Portions" value={form.servings} onChange={(e) => setForm({ ...form, servings: e.target.value })} />
                  <input className="input" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} />
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
