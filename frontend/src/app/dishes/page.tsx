"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronUp, Clock3, Flame, Search, Star, TimerReset, Zap } from "lucide-react";
import DishCard, { Dish } from "@/components/DishCard";
import Pagination from "@/components/Pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet } from "@/lib/api";

const ITEMS_PER_PAGE = 12;

const defaultFilters = {
  search: "",
  city: "",
  price: "",
  seller: "",
  maxTime: "",
  category: "",
  sort: "",
};

const DISH_CATEGORIES = [
  "Soupes",
  "Salades",
  "Pates",
  "Ragout",
  "Viande",
  "Tajine",
  "Sandwich",
  "fruit de mer et poisson",
  "entree tunisien",
  "Couscous",
];

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Dish[]>("/api/dishes")
      .then(setDishes)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => Array.from(new Set(dishes.map((dish) => dish.city).filter(Boolean))), [dishes]);
  const sellers = useMemo(() => {
    const sellerMap = new Map<number, string>();
    dishes.forEach((dish) => {
      if (dish.seller) {
        sellerMap.set(dish.seller.id, `${dish.seller.firstName} ${dish.seller.lastName}`.trim());
      }
    });
    return Array.from(sellerMap, ([id, name]) => ({ id, name }));
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    const filtered = dishes.filter((dish) => {
      const search = filters.search.trim().toLowerCase();
      const matchesSearch = search === "" || `${dish.name} ${dish.description}`.toLowerCase().includes(search);
      const matchesCity = filters.city === "" || dish.city === filters.city;
      const matchesSeller = filters.seller === "" || dish.seller?.id === Number(filters.seller);
      const matchesPrice =
        filters.price === "" ||
        (filters.price === "0-15" && dish.price <= 15) ||
        (filters.price === "15-30" && dish.price > 15 && dish.price <= 30) ||
        (filters.price === "30+" && dish.price > 30);
      const matchesTime = filters.maxTime === "" || (dish.preparationTime || 30) <= Number(filters.maxTime);
      const matchesCategory =
        filters.category === "" || getCatalogCategory(dish.name, dish.description) === filters.category;

      return matchesSearch && matchesCity && matchesSeller && matchesPrice && matchesTime && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === "fastest" || filters.sort === "prep" || filters.sort === "cook") {
        return (a.preparationTime || 30) - (b.preparationTime || 30);
      }
      return 0;
    });
  }, [dishes, filters]);

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main className="bg-[#f8f1e6]">
        <div className="mx-auto grid max-w-[1420px] gap-8 px-5 py-8 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-7">
            <FilterSection title="Categorie">
              {DISH_CATEGORIES.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilters({ ...filters, category: filters.category === item ? "" : item })}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                    filters.category === item
                      ? "bg-white text-orange-700 shadow-sm"
                      : "text-stone-600 hover:bg-white hover:text-orange-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </FilterSection>

            <FilterSection title="Ville">
              <select className="input" value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })}>
                <option value="">Toutes les villes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </FilterSection>

            <FilterSection title="Vendeur">
              <select className="input" value={filters.seller} onChange={(event) => setFilters({ ...filters, seller: event.target.value })}>
                <option value="">Tous les vendeurs</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </FilterSection>

            <FilterSection title="Prix">
              {[
                ["0-15", "<= 15 DT"],
                ["15-30", "15 - 30 DT"],
                ["30+", "30 DT et plus"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilters({ ...filters, price: filters.price === value ? "" : value })}
                  className={`block w-full rounded-lg border px-4 py-3 text-left text-sm font-bold transition ${
                    filters.price === value
                      ? "border-orange-200 bg-white text-orange-700"
                      : "border-stone-200 text-stone-600 hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </FilterSection>

            <FilterSection title="Temps">
              <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase text-stone-500">
                <Clock3 size={15} className="text-orange-700" /> Preparation
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[15, 30, 45, 60].map((time) => (
                  <button
                    key={time}
                    onClick={() => setFilters({ ...filters, maxTime: filters.maxTime === String(time) ? "" : String(time) })}
                    className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                      filters.maxTime === String(time)
                        ? "border-orange-200 bg-white text-orange-700"
                        : "border-stone-200 text-stone-600"
                    }`}
                  >
                    {"<= "} {time === 60 ? "1h" : `${time} min`}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Trier par">
              {[
                ["rated", <Star key="star" size={15} className="text-amber-400" fill="currentColor" />, "Mieux note"],
                ["fastest", <Zap key="zap" size={15} className="text-orange-500" />, "Plus rapide"],
                ["prep", <TimerReset key="timer" size={15} className="text-purple-500" />, "Prepa rapide"],
                ["cook", <Flame key="flame" size={15} className="text-red-500" />, "Cuisson rapide"],
              ].map(([value, icon, label]) => (
                <button
                  key={String(value)}
                  onClick={() => setFilters({ ...filters, sort: filters.sort === value ? "" : String(value) })}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition ${
                    filters.sort === value
                      ? "border-orange-200 bg-white text-orange-700"
                      : "border-stone-200 text-stone-600 hover:bg-white"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </FilterSection>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="badge">Marketplace tunisienne</span>
                <h1 className="mt-3 text-3xl font-extrabold text-stone-950">Catalogue plats</h1>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    className="input w-full pl-10 md:w-80"
                    placeholder="Chercher..."
                    value={filters.search}
                    onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                  />
                </div>
                <button className="btn-secondary py-2" onClick={() => setFilters(defaultFilters)}>
                  Reset
                </button>
              </div>
            </div>

            {loading ? <div className="card p-8 text-center">Chargement des plats...</div> : null}
            {error ? <div className="card p-8 text-center text-red-600">{error}</div> : null}

            {!loading && filteredDishes.length > 0 ? (
              <>
                <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedDishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : null}

            {!loading && !error && filteredDishes.length === 0 ? (
              <div className="card p-8 text-center text-stone-600">Aucun plat ne correspond à ces filtres.</div>
            ) : null}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function getCatalogCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (/(couscous)/.test(text)) return "Couscous";
  if (/(soupe|chorba|hssou|lablebi|mhamsa)/.test(text)) return "Soupes";
  if (/(salade|houria|mechouia)/.test(text)) return "Salades";
  if (/(pates|spaghetti|makarouna|dwida|nwasser|riz djerbien|vermicelles|tagliatelle|cheveux d'ange)/.test(text)) {
    return "Pates";
  }
  if (/(ojja|kamounia|markat|mloukhia|chakchouka|haricots blancs)/.test(text)) return "Ragout";
  if (/(brochettes|kebab|poulet farci|steak d'agneau|grillade|tete d'agneau|kadid|allouch)/.test(text)) {
    return "Viande";
  }
  if (/(tajine)/.test(text)) return "Tajine";
  if (/(sandwich|chapati|casse croute|mtabga|fricasse|baguette farcie|tabouna)/.test(text)) {
    return "Sandwich";
  }
  if (/(kabkabou|poisson|poulpe|crevettes|fruits de mer|calamars|thon|sardines|mosli hout)/.test(text)) {
    return "fruit de mer et poisson";
  }
  if (/(brik|brick|kefta|doigts de fatma|chebtiya|sahfa thoum)/.test(text)) return "entree tunisien";

  return "Sandwich";
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between border-b border-stone-200 pb-3">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-500">{title}</h2>
        <ChevronUp size={15} className="text-stone-500" />
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
