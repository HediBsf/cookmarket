import Image from "next/image";
import Link from "next/link";
import { Clock3, Eye, Flame, Star } from "lucide-react";

export type Recipe = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  difficulty: string;
  preparationTime: number;
  cookingTime?: number;
  category?: string | { id: number; name: string; type?: string };
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel =
    typeof recipe.category === "string" ? recipe.category : recipe.category?.name || "Cuisine tunisienne";
  const totalTime = recipe.preparationTime + (recipe.cookingTime || 0);

  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_2px_12px_rgba(23,23,20,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(23,23,20,0.16)]">
      <div className="relative h-56 bg-stone-100">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="image-zoom object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-bold text-red-900">
            Recette maison
          </div>
        )}
        <span className="absolute left-4 top-4 rounded bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-widest text-orange-700 shadow-sm">
          {categoryLabel}
        </span>
        <Link
          href={`/recipes/${recipe.id}`}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-red-800 hover:text-white"
          aria-label={`Lire ${recipe.title}`}
        >
          <Eye size={18} />
        </Link>
      </div>
      <div className="flex min-h-64 flex-col p-6">
        <h3 className="line-clamp-2 text-xl font-extrabold leading-snug text-stone-950">{recipe.title}</h3>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-600">{recipe.description}</p>
        <div className="mt-4 flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} fill="currentColor" />
          ))}
          <span className="ml-2 text-xs font-bold text-stone-600">(5)</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-5 text-xs font-extrabold uppercase text-stone-600">
          <span className="inline-flex items-center gap-2">
            <Clock3 size={15} className="text-orange-700" />
            {formatTime(totalTime)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Flame size={15} className="text-orange-700" />
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </article>
  );
}

function formatTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} MIN`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}H ${rest} MIN` : `${hours}H`;
}
