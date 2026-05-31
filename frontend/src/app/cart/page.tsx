"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiPost } from "@/lib/api";
import { CartItem, clearCart, getCart, removeFromCart, updateQuantity } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";

const DELIVERY_FEE = 7;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    d17TransferReference: "",
    d17TransferProof: "",
    confirmed: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const hasFormation = useMemo(() => cartItems.some((item) => item.itemType === "FORMATION"), [cartItems]);
  const hasDish = useMemo(() => cartItems.some((item) => item.itemType === "DISH"), [cartItems]);
  const hasMixedItems = hasFormation && hasDish;
  const formationSellerIds = useMemo(
    () => Array.from(new Set(cartItems.filter((item) => item.itemType === "FORMATION").map((item) => item.sellerId).filter(Boolean))),
    [cartItems],
  );
  const hasMultipleFormationSellers = formationSellerIds.length > 1;
  const formationSeller = useMemo(() => cartItems.find((item) => item.itemType === "FORMATION"), [cartItems]);
  const sellerD17PhoneNumber = formationSeller?.sellerD17PhoneNumber;
  const deliveryFee = hasDish ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    setCartItems(getCart());
    const user = getCurrentUser();
    if (user) {
      setForm((current) => ({
        ...current,
        customerFirstName: user.firstName,
        customerLastName: user.lastName,
        customerEmail: user.email,
      }));
    }
  }, []);

  function refreshCart() {
    setCartItems(getCart());
  }

  function handleRemove(id: number, itemType: CartItem["itemType"]) {
    removeFromCart(id, itemType);
    refreshCart();
  }

  function handleUpdateQuantity(id: number, itemType: CartItem["itemType"], quantity: number) {
    updateQuantity(id, itemType, quantity);
    refreshCart();
  }

  function handleProofUpload(file?: File) {
    if (!file) {
      setForm({ ...form, d17TransferProof: "" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, d17TransferProof: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.confirmed) {
      setError("Veuillez confirmer votre commande.");
      return;
    }
    if (hasMixedItems) {
      setError("Veuillez commander les plats et les formations separement.");
      return;
    }
    if (hasFormation && hasMultipleFormationSellers) {
      setError("Veuillez commander les formations de vendeurs differents separement.");
      return;
    }
    if (hasFormation && !sellerD17PhoneNumber) {
      setError("Numero D17 du vendeur indisponible. Supprimez puis ajoutez de nouveau la formation au panier.");
      return;
    }
    if (!form.customerFirstName || !form.customerLastName || !form.customerEmail || !form.customerPhone) {
      setError("Veuillez remplir vos informations de contact.");
      return;
    }
    if (hasDish && (!form.deliveryAddress || !form.deliveryCity)) {
      setError("Veuillez remplir les informations de livraison pour les plats.");
      return;
    }
    if (hasFormation && (!form.d17TransferReference || !form.d17TransferProof)) {
      setError("Veuillez saisir la reference D17 et ajouter la capture du transfert.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiPost("/api/orders", {
        ...form,
        deliveryFee,
        items: cartItems.map((item) => ({
          id: item.id,
          itemType: item.itemType,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setCartItems([]);
      setMessage(hasFormation
        ? "Commande formation envoyee. Le vendeur va verifier le transfert D17 puis confirmer."
        : "Commande confirmee. Paiement a la livraison, total a payer : " + total.toFixed(2) + " DT.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Commande impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main className="page-container">
        <div className="mb-8 animate-fade-in">
          <span className="badge">{hasFormation ? "Paiement D17" : "Paiement a la livraison"}</span>
          <h1 className="section-title mt-4">Panier</h1>
          <p className="mt-2 text-stone-600">
            {hasMixedItems
              ? "Les plats et les formations doivent etre commandes separement."
              : hasFormation
                ? "Pour les formations, transferez le montant par D17 puis ajoutez la preuve. Aucune livraison."
                : "Livraison fixe partout en Tunisie : 7 DT."}
          </p>
        </div>

        {message ? <div className="card mb-6 border-green-200 bg-green-50 p-5 text-green-800">{message}</div> : null}
        {hasMixedItems ? (
          <div className="card mb-6 border-red-200 bg-red-50 p-5 text-red-700">
            Votre panier contient des plats et des formations. Supprimez un type d'article et passez deux commandes separees.
          </div>
        ) : null}
        {hasMultipleFormationSellers ? (
          <div className="card mb-6 border-red-200 bg-red-50 p-5 text-red-700">
            Votre panier contient des formations de plusieurs vendeurs. Passez une commande separee pour chaque vendeur afin de payer le bon numero D17.
          </div>
        ) : null}

        {cartItems.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg text-stone-600">Votre panier est vide.</p>
            <a href="/dishes" className="btn-primary mt-4 inline-flex">Explorer les plats</a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.itemType}-${item.id}`} className="card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="badge">{item.itemType === "DISH" ? "Plat" : "Formation"}</span>
                    <h2 className="mt-2 text-lg font-bold">{item.name}</h2>
                    <p className="mt-1 font-semibold text-red-900">{item.price} DT</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => handleUpdateQuantity(item.id, item.itemType, item.quantity - 1)} className="btn-secondary px-3 py-1">-</button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.itemType, item.quantity + 1)} className="btn-secondary px-3 py-1">+</button>
                    <button onClick={() => handleRemove(item.id, item.itemType)} className="btn-danger">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>

            <form className="card h-fit p-6" onSubmit={handleCheckout}>
              <h2 className="mb-5 text-2xl font-bold">Informations de commande</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Prénom" value={form.customerFirstName} onChange={(e) => setForm({ ...form, customerFirstName: e.target.value })} />
                <input className="input" placeholder="Nom" value={form.customerLastName} onChange={(e) => setForm({ ...form, customerLastName: e.target.value })} />
                <input className="input md:col-span-2" type="email" placeholder="Email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                <input className="input md:col-span-2" placeholder="Téléphone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
                {hasDish ? (
                  <>
                    <input className="input md:col-span-2" placeholder="Adresse complète" value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
                    <input className="input md:col-span-2" placeholder="Ville / gouvernorat" value={form.deliveryCity} onChange={(e) => setForm({ ...form, deliveryCity: e.target.value })} />
                  </>
                ) : null}
              </div>

              <div className="my-6 space-y-3 border-y border-stone-200 py-5">
                <div className="flex justify-between"><span>Sous-total</span><strong>{subtotal.toFixed(2)} DT</strong></div>
                {hasDish ? <div className="flex justify-between"><span>Livraison</span><strong>{deliveryFee.toFixed(2)} DT</strong></div> : null}
                <div className="flex justify-between text-lg"><span className="font-bold">Total à payer</span><strong className="text-red-900">{total.toFixed(2)} DT</strong></div>
              </div>

              {hasFormation ? (
                <div className="mb-6 rounded-lg border border-red-800/20 bg-amber-50 p-4">
                  <h3 className="font-bold text-red-950">Paiement formation par D17</h3>
                  <p className="mt-2 text-sm text-stone-700">
                    Envoyez <strong>{total.toFixed(2)} DT</strong> au numero D17 du vendeur{formationSeller?.sellerName ? ` ${formationSeller.sellerName}` : ""} :
                  </p>
                  <p className="mt-2 rounded-lg bg-white p-3 text-lg font-extrabold text-red-900">{sellerD17PhoneNumber || "Numero indisponible"}</p>
                  <div className="mt-4 grid gap-3">
                    <input
                      className="input"
                      placeholder="Reference / ID du transfert D17"
                      value={form.d17TransferReference}
                      onChange={(e) => setForm({ ...form, d17TransferReference: e.target.value })}
                    />
                    <label className="text-sm font-semibold text-stone-700">
                      Capture du transfert
                      <input className="input mt-2" type="file" accept="image/*" onChange={(e) => handleProofUpload(e.target.files?.[0])} />
                    </label>
                    {form.d17TransferProof ? (
                      <img src={form.d17TransferProof} alt="Preuve D17" className="h-32 w-full rounded-lg object-cover" />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <label className="mb-4 flex items-start gap-3 text-sm text-stone-700">
                <input type="checkbox" className="mt-1" checked={form.confirmed} onChange={(e) => setForm({ ...form, confirmed: e.target.checked })} />
                Je confirme ma commande.
              </label>
              <p className="mb-4 text-sm font-semibold text-stone-700">Paiement : {hasFormation ? "transfert D17 a confirmer par le vendeur." : "paiement a la livraison uniquement."}</p>
              {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
              <button className="btn-primary w-full" disabled={loading || hasMixedItems || hasMultipleFormationSellers}>{loading ? "Validation..." : "Confirmer la commande"}</button>
            </form>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
