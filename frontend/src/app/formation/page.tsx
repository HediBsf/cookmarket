"use client";

import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiGet } from "@/lib/api";
import { addToCart } from "@/lib/cart";

const ITEMS_PER_PAGE = 12;

interface Formation {
  id: number;
  title: string;
  description: string;
  price: number;
  duration?: string;
  level?: string;
  imageUrl?: string;
  seller?: { id: number; firstName: string; lastName: string; city?: string | null; sellerD17PhoneNumber?: string | null };
}

export default function FormationPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [sellerFilter, setSellerFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Formation[]>("/api/formations")
      .then(setFormations)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setLoading(false));
  }, []);

  const sellers = useMemo(() => {
    const sellerMap = new Map<number, string>();
    formations.forEach((formation) => {
      if (formation.seller) {
        sellerMap.set(formation.seller.id, `${formation.seller.firstName} ${formation.seller.lastName}`);
      }
    });
    return Array.from(sellerMap, ([id, name]) => ({ id, name }));
  }, [formations]);

  const filteredFormations = useMemo(() => {
    if (!sellerFilter) {
      return formations;
    }
    return formations.filter((formation) => formation.seller?.id === Number(sellerFilter));
  }, [formations, sellerFilter]);

  const totalPages = Math.ceil(filteredFormations.length / ITEMS_PER_PAGE);
  const paginatedFormations = filteredFormations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sellerFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleAddToCart(formation: Formation) {
    addToCart({
      id: formation.id,
      itemType: "FORMATION",
      name: formation.title,
      price: formation.price,
      imageUrl: formation.imageUrl,
      sellerId: formation.seller?.id,
      sellerName: formation.seller ? `${formation.seller.firstName} ${formation.seller.lastName}` : undefined,
      sellerD17PhoneNumber: formation.seller?.sellerD17PhoneNumber,
    });
    setAddedItems((prev) => new Set([...prev, formation.id]));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(formation.id);
        return next;
      });
    }, 2000);
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main className="page-container">
        <div className="mb-8 animate-fade-in">
          <span className="badge">Formations</span>
          <h1 className="section-title mt-4">Apprendre avec les chefs بنة تونسية</h1>
          <p className="mt-2 max-w-2xl text-stone-600">
            Des cours pratiques pour progresser en cuisine et découvrir de nouvelles techniques.
          </p>
        </div>

        <div className="mb-8 max-w-sm">
          <select className="input" value={sellerFilter} onChange={(event) => setSellerFilter(event.target.value)}>
            <option value="">Tous les vendeurs</option>
            {sellers.map((seller) => <option key={seller.id} value={seller.id}>{seller.name}</option>)}
          </select>
        </div>

        {loading ? <div className="card p-8 text-center">Chargement des formations...</div> : null}
        {error ? <div className="card p-8 text-center text-red-600">{error}</div> : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedFormations.map((formation) => (
            <div key={formation.id} className="card group flex flex-col overflow-hidden animate-slide-up hover:-translate-y-1">
              <div className="h-44 bg-stone-100">
                {formation.imageUrl ? (
                  <img src={formation.imageUrl} alt={formation.title} className="image-zoom h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-bold text-red-900">
                    Atelier culinaire
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-2xl font-bold">{formation.title}</h2>
                {formation.seller ? (
                  <p className="mt-2 text-sm font-semibold text-stone-700">
                    Vendeur: {formation.seller.firstName} {formation.seller.lastName}
                  </p>
                ) : null}
                <p className="mt-2 flex-1 text-sm text-stone-600">{formation.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {formation.level ? <span className="badge">{formation.level}</span> : null}
                  {formation.duration ? <span className="badge">{formation.duration}</span> : null}
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-200 pt-5">
                  <span className="text-2xl font-extrabold text-red-900">{formation.price} DT</span>
                  <button onClick={() => handleAddToCart(formation)} className={addedItems.has(formation.id) ? "btn-success" : "btn-primary"}>
                    {addedItems.has(formation.id) ? "Ajoutée" : "Ajouter"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && filteredFormations.length > 0 ? (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        ) : null}
        {!loading && !error && filteredFormations.length === 0 ? (
          <div className="card p-8 text-center text-stone-600">Aucune formation ne correspond a ce filtre.</div>
        ) : null}
      </main>
    </ProtectedRoute>
  );
}
