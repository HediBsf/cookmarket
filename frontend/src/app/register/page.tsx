"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { UserRole } from "@/lib/auth";

type RegisterResponse = {
  message: string;
};

const D17_ADMIN_PHONE_NUMBER = process.env.NEXT_PUBLIC_D17_PHONE_NUMBER || "+216 95327309";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [sellerD17PhoneNumber, setSellerD17PhoneNumber] = useState("");
  const [sellerSubscriptionReference, setSellerSubscriptionReference] = useState("");
  const [sellerSubscriptionProof, setSellerSubscriptionProof] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (role === "SELLER" && (!sellerD17PhoneNumber || !sellerSubscriptionReference || !sellerSubscriptionProof)) {
      setError("Pour un compte vendeur, ajoutez le numero D17, la reference du transfert et la capture.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await apiPost<RegisterResponse>("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        phone,
        city,
        role,
        sellerD17PhoneNumber,
        sellerSubscriptionReference,
        sellerSubscriptionProof,
      });
      setSuccess(response.message || "Compte cree. Vous pouvez vous connecter.");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  }

  function handleProofUpload(file?: File) {
    if (!file) {
      setSellerSubscriptionProof("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setSellerSubscriptionProof(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <main className="page-container min-h-[80vh] flex items-center justify-center">
      <form className="card p-8 w-full max-w-2xl animate-slide-up" onSubmit={handleSubmit}>
        <span className="badge">Nouveau compte</span>
        <h1 className="section-title mt-4 mb-6">Créer un compte</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Prénom" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          <input className="input" placeholder="Nom" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input className="input" placeholder="Téléphone" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <input className="input" placeholder="Ville" value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
        <label htmlFor="role" className="font-semibold mt-4 block">Je suis</label>
        <select id="role" className="input mt-2" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="CLIENT">Client</option>
          <option value="SELLER">Vendeur</option>
        </select>

        {role === "SELLER" ? (
          <div className="mt-5 grid gap-4 rounded-lg border border-red-900/15 bg-amber-50 p-4">
            <div>
              <h2 className="text-lg font-extrabold text-red-950">Paiement abonnement vendeur</h2>
              <p className="mt-1 text-sm text-stone-700">
                Envoyez le paiement au numero D17 admin, puis ajoutez la reference et la capture du transfert.
              </p>
              <p className="mt-3 rounded-lg bg-white p-3 text-xl font-extrabold text-red-900">{D17_ADMIN_PHONE_NUMBER}</p>
            </div>
            <input
              className="input"
              placeholder="Votre numero D17 vendeur"
              value={sellerD17PhoneNumber}
              onChange={(event) => setSellerD17PhoneNumber(event.target.value)}
            />
            <input
              className="input"
              placeholder="Reference / ID du transfert D17 vers admin"
              value={sellerSubscriptionReference}
              onChange={(event) => setSellerSubscriptionReference(event.target.value)}
            />
            <label className="text-sm font-semibold text-stone-700">
              Capture du transfert D17
              <input className="input mt-2" type="file" accept="image/*" onChange={(event) => handleProofUpload(event.target.files?.[0])} />
            </label>
            {sellerSubscriptionProof ? (
              <img src={sellerSubscriptionProof} alt="Capture transfert D17" className="h-40 w-full rounded-lg object-cover" />
            ) : null}
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600 mb-4 mt-4">{error}</p> : null}
        {success ? <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">{success}</p> : null}
        <button className="btn-primary w-full mt-6" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>
      </form>
    </main>
  );
}
