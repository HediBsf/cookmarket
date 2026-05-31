"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChefHat, Clock, ListChecks, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet } from "@/lib/api";

type RecipeDetail = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  ingredients: string;
  steps: string;
  preparationTime: number;
  cookingTime?: number | null;
  difficulty: string;
  servings?: number | null;
  createdAt?: string;
  user?: { id: number; firstName: string; lastName: string };
  category?: { id: number; name: string } | null;
  comments?: { id: number; content: string; createdAt: string }[];
};

function splitText(value: string) {
  return value
    .split(/\r?\n|\.|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) {
      return;
    }

    setLoading(true);
    setError("");
    apiGet<RecipeDetail | null>(`/api/recipes/${params.id}`)
      .then((data) => {
        if (!data) {
          setError("Recette introuvable.");
          return;
        }
        setRecipe(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  }, [params.id]);

  const ingredients = useMemo(() => splitText(recipe?.ingredients ?? ""), [recipe?.ingredients]);
  const steps = useMemo(() => splitText(recipe?.steps ?? ""), [recipe?.steps]);
  const totalTime = (recipe?.preparationTime ?? 0) + (recipe?.cookingTime ?? 0);

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <button type="button" onClick={() => router.back()} className="btn-secondary mb-4 inline-flex items-center gap-2 px-4 py-2">
          <ArrowLeft size={18} />
          Retour
        </button>

        {loading ? <div className="card p-8 text-center">Chargement de la recette...</div> : null}
        {error ? (
          <div className="card p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <Link href="/recipes" className="btn-primary mt-5">
              Voir les recettes
            </Link>
          </div>
        ) : null}

        {!loading && recipe ? (
          <div className="animate-fade-in">
            <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge">{recipe.difficulty}</span>
                  {recipe.category ? <span className="badge-muted">{recipe.category.name}</span> : null}
                </div>
                <h1 className="mt-3 text-3xl font-extrabold leading-tight text-stone-950 md:text-4xl">{recipe.title}</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">{recipe.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="card p-3">
                    <Clock className="mb-1 text-red-900" size={20} />
                    <p className="text-xs uppercase tracking-wide text-stone-500">Temps total</p>
                    <p className="text-base font-extrabold">{totalTime} min</p>
                  </div>
                  <div className="card p-3">
                    <ChefHat className="mb-1 text-red-900" size={20} />
                    <p className="text-xs uppercase tracking-wide text-stone-500">Preparation</p>
                    <p className="text-base font-extrabold">{recipe.preparationTime} min</p>
                  </div>
                  <div className="card p-3">
                    <Users className="mb-1 text-red-900" size={20} />
                    <p className="text-xs uppercase tracking-wide text-stone-500">Portions</p>
                    <p className="text-base font-extrabold">{recipe.servings ?? "-"}</p>
                  </div>
                </div>

                {recipe.user ? (
                  <p className="mt-4 text-sm font-semibold text-stone-600">
                    Partagee par {recipe.user.firstName} {recipe.user.lastName}
                  </p>
                ) : null}
              </div>

              <div className="elevated-image group bg-stone-100">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} className="image-zoom h-[250px] w-full object-cover md:h-[340px]" />
                ) : (
                  <div className="flex h-[250px] items-center justify-center font-bold text-red-900 md:h-[340px]">
                    Recette maison
                  </div>
                )}
              </div>
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="card p-5">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <ListChecks size={22} className="text-red-900" />
                  Ingredients
                </h2>
                <ul className="mt-4 space-y-2">
                  {ingredients.map((ingredient) => (
                    <li key={ingredient} className="flex gap-3 rounded-lg bg-stone-50 p-2.5 text-sm font-medium text-stone-700">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-800" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-5">
                <h2 className="text-xl font-bold">Etapes</h2>
                <ol className="mt-4 space-y-3">
                  {steps.map((step, index) => (
                    <li key={`${step}-${index}`} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-800 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-6 text-stone-700">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {recipe.comments && recipe.comments.length > 0 ? (
              <section className="card mt-5 p-5">
                <h2 className="text-xl font-bold">Commentaires</h2>
                <div className="mt-3 grid gap-3">
                  {recipe.comments.map((comment) => (
                    <p key={comment.id} className="rounded-lg bg-stone-50 p-4 text-sm text-stone-700">
                      {comment.content}
                    </p>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
