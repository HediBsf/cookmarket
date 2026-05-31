"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronUp, Clock3, Flame, Search, Star, TimerReset, Zap } from "lucide-react";
import RecipeCard, { Recipe } from "@/components/RecipeCard";
import Pagination from "@/components/Pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet } from "@/lib/api";

const ITEMS_PER_PAGE = 12;

const CATEGORY_OPTIONS = [
  "Soupes",
  "Salades",
  "Pâtisserie",
  "Pâtes",
  "Ragoût",
  "Viande",
  "Tajine",
  "Sandwichs",
  "fruits de mer et poissons",
  "Entrées Tunisiennes",
  "Recettes de pain Tunisien",
  "Couscous",
] as const;

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Recipe[]>("/api/recipes")
      .then((data) => setRecipes(shuffleRecipes(data)))
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecipes = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = recipes.filter((recipe) => {
      const matchesSearch =
        term === "" || `${recipe.title} ${recipe.description}`.toLowerCase().includes(term);
      const matchesCategory =
        category === "" || getCatalogCategory(recipe.title, recipe.description) === category;
      const totalTime = recipe.preparationTime + (recipe.cookingTime || 0);
      const matchesTime = maxTime === "" || totalTime <= Number(maxTime);
      return matchesSearch && matchesCategory && matchesTime;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "fastest" || sort === "prep") {
        return a.preparationTime - b.preparationTime;
      }
      if (sort === "cook") {
        return (a.cookingTime || 0) - (b.cookingTime || 0);
      }
      return 0;
    });
  }, [recipes, search, category, maxTime, sort]);

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, maxTime, sort]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function resetFilters() {
    setSearch("");
    setMaxTime("");
    setSort("");
    setCategory("");
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main className="bg-[#f8f1e6]">
        <div className="mx-auto grid max-w-[1420px] gap-8 px-5 py-8 lg:grid-cols-[300px_1fr]">
          <CatalogSidebar
            category={category}
            maxTime={maxTime}
            sort={sort}
            onCategory={setCategory}
            onMaxTime={setMaxTime}
            onSort={setSort}
          />

          <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="badge">Recettes tunisiennes</span>
                <h1 className="mt-3 text-3xl font-extrabold text-stone-950">Catalogue recettes</h1>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    className="input w-full pl-10 md:w-80"
                    placeholder="Chercher..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <button className="btn-secondary py-2" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>

            {loading ? <div className="card p-8 text-center">Chargement des recettes...</div> : null}
            {error ? <div className="card p-8 text-center text-red-600">{error}</div> : null}

            {!loading && filteredRecipes.length > 0 ? (
              <>
                <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : null}

            {!loading && !error && filteredRecipes.length === 0 ? (
              <div className="card p-8 text-center text-stone-600">
                Aucune recette ne correspond à cette recherche.
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function shuffleRecipes(recipes: Recipe[]) {
  const items = [...recipes];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  return items;
}

function CatalogSidebar({
  maxTime,
  sort,
  category,
  onCategory,
  onMaxTime,
  onSort,
}: {
  maxTime: string;
  sort: string;
  category: string;
  onCategory: (value: string) => void;
  onMaxTime: (value: string) => void;
  onSort: (value: string) => void;
}) {
  return (
    <aside className="space-y-7">
      <FilterSection title="Categorie">
        {CATEGORY_OPTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onCategory(category === item ? "" : item)}
            className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
              category === item
                ? "bg-white text-orange-700 shadow-sm"
                : "text-stone-600 hover:bg-white hover:text-orange-700"
            }`}
          >
            {item}
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
              onClick={() => onMaxTime(maxTime === String(time) ? "" : String(time))}
              className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                maxTime === String(time)
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
            onClick={() => onSort(sort === value ? "" : String(value))}
            className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition ${
              sort === value
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
  );
}

function getCatalogCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (/(couscous aux sardines|couscous tunisien a l'agneau|couscous au poulpe|couscous complet aux legumes et au poulet|couscous au poisson tunisien|couscous tunisien au fenouil|farfoucha|mesfouf aux graines de grenade)/.test(text)) {
    return "Couscous";
  }

  if (/(pain mlawi tunisien|pain hamburger maison ultra moelleux|pain aux olives|pain baguette fait maison sans semoule|pain tabouna au four|pain traditionnel pour aid al adha|petits pains farcis au thon|khobz el ghanney)/.test(text)) {
    return "Recettes de pain Tunisien";
  }

  if (/(mosli hout|poisson au four|sardines farcies a la tunisienne au four|poisson et salade tunisienne grillee|calamars farcis a la tunisienne)/.test(text)) {
    return "fruits de mer et poissons";
  }

  if (/(sandwich malfouf tunisien|spicy burger a la tunisienne|mtabga|casse croute tunisien|chapati tunisien|chapati mahdia|fricasses tunisiens au four|baguette farcie|petits pains farcis thon, poulet et fromage)/.test(text)) {
    return "Sandwichs";
  }

  if (/(tajine de pates au poulet|tajine a la pate feuilletee|tajine minina tunisienne|tajine el bey|tajine de salade mechouia|tajine des biscuits sales|quiche aux epinards et a la ricotta|tajine tunisien en croute)/.test(text)) {
    return "Tajine";
  }

  if (/(kefta au poulet|kefta au thon|kefta tunisienne de poisson|brik danouni aux epinards|brik de la goulette a la pate fraiche|doigts de fatma au four|brik dannouni|brik aux chevrettes|brick tunisienne au thon|brik tunisienne|les doigts de fatma|fricasse tunisien|fricasses tunisiens au four|chebtiya|sahfa thoum|la salade blankit tunisienne)/.test(text)) {
    return "Entrées Tunisiennes";
  }

  if (/(brochettes d'agneau aux legumes|grillade de steaks de viande hachee|tete d'agneau rotie au four|kadid viande sechee|allouch fel kolla|agneau a la gargoulette|kebab au poulet|poulet farci|steak d'agneau a la creme de champignons)/.test(text)) {
    return "Viande";
  }

  if (/(pates aux boulettes de viande|pates tunisiennes au poisson|tagliatelle au poulet|dwida jaria|dwida mfawra|nwasser|chorba mfawara|cheveux d'ange aux boulettes|cheveux d'anges aux fruits de mer|pate ressort|riz djerbien|vermicelles tunisiennes a la viande|douida mfawra|tajine de pates au poulet)/.test(text)) {
    return "Pâtes";
  }

  if (/(cuisse de poulet au four|ain sbaniouria|lahmet thon au four|mloukhia tunisienne|chakchouka au kadid|kamounia$|haricots blancs aux boulettes de viande|kafteji au foie|ojja aux merguez|ojja aux boulettes de viande|ojja bil mokh|ojja aux fruits de mer)/.test(text)) {
    return "Ragoût";
  }

  if (/(soupe|chorba|hssou|lablebi|mhamsa)/.test(text)) return "Soupes";
  if (/(salade|houria|mechouia)/.test(text)) return "Salades";
  if (/(makroudh|bambalouni|dessert|gateau|g[âa]teau|patisserie|baklawa|basboussa|bachkoutou|petits fours|ghrayba|homsia|kaak|debla|bouza|creme aux noisettes|zouza|khobzet hwe|khobzet hw[eè]|dr[oô]o)/.test(text)) {
    return "Pâtisserie";
  }
  if (/(spaghetti|pates|makarouna|crepe)/.test(text)) return "Pâtes";
  if (/(markat|kamounia|rago[uû]t)/.test(text)) return "Ragoût";
  if (/(boeuf|viande|boulettes)/.test(text)) return "Viande";
  if (/(tajine)/.test(text)) return "Tajine";
  if (/(sandwich|fricasse)/.test(text)) return "Sandwichs";
  if (/(poulpe|crevettes|fruits de mer|poisson|kabkabou|calamars|thon)/.test(text)) {
    return "fruits de mer et poissons";
  }
  if (/(brik|brick|felfel|entree|kefta|doigts de fatma|chebtiya)/.test(text)) {
    return "Entrées Tunisiennes";
  }
  if (/(pain|tabouna)/.test(text)) return "Recettes de pain Tunisien";
  if (/(couscous)/.test(text)) return "Couscous";

  return "Entrées Tunisiennes";
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
