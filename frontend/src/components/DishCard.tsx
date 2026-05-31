"use client";

import { useState } from "react";
import { Clock3, Eye, Flame, ShoppingBag, Star } from "lucide-react";
import { addToCart } from "@/lib/cart";

export type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  city: string;
  imageUrl?: string;
  preparationTime?: number;
  category?: string | { id: number; name: string; type?: string };
  seller?: { id: number; firstName: string; lastName: string; city?: string | null };
};

export default function DishCard({ dish }: { dish: Dish }) {
  const [added, setAdded] = useState(false);
  const categoryLabel =
    typeof dish.category === "string" ? dish.category : dish.category?.name || "Plat tunisien";

  function handleOrder() {
    addToCart({
      id: dish.id,
      itemType: "DISH",
      name: dish.name,
      price: dish.price,
      imageUrl: dish.imageUrl,
      sellerId: dish.seller?.id,
      sellerName: dish.seller ? `${dish.seller.firstName} ${dish.seller.lastName}` : undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_2px_12px_rgba(23,23,20,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(23,23,20,0.16)]">
      <div className="relative h-56 bg-stone-100">
        {dish.imageUrl ? (
          <img src={dish.imageUrl} alt={dish.name} className="image-zoom h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-bold text-red-900">
            Plat maison
          </div>
        )}
        <span className="absolute left-4 top-4 rounded bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-widest text-orange-700 shadow-sm">
          {categoryLabel}
        </span>
        <button
          type="button"
          onClick={handleOrder}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-red-800 hover:text-white"
          aria-label={`Commander ${dish.name}`}
        >
          {added ? <ShoppingBag size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="flex min-h-64 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-xl font-extrabold leading-snug text-stone-950">{dish.name}</h3>
          <span className="shrink-0 font-extrabold text-red-900">{dish.price} DT</span>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-600">{dish.description}</p>
        {dish.seller ? (
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-stone-500">
            {dish.seller.firstName} {dish.seller.lastName} - {dish.city}
          </p>
        ) : null}
        <div className="mt-4 flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} fill="currentColor" />
          ))}
          <span className="ml-2 text-xs font-bold text-stone-600">(5)</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-5 text-xs font-extrabold uppercase text-stone-600">
          <span className="inline-flex items-center gap-2">
            <Clock3 size={15} className="text-orange-700" />
            {dish.preparationTime ? formatTime(dish.preparationTime) : "30 MIN"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Flame size={15} className="text-orange-700" />
            Moyen
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
