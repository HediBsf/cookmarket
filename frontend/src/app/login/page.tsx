"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { AuthResponse, getCurrentUser, getDashboardPath, isAuthenticated, saveSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(getDashboardPath(getCurrentUser()?.role));
      return;
    }

    const verified = new URLSearchParams(window.location.search).get("verified");
    const googleError = new URLSearchParams(window.location.search).get("error");
    if (verified === "1") {
      setMessage("Email verifie avec succes. Vous pouvez vous connecter.");
    }
    if (verified === "0") {
      setError("Lien de verification invalide ou expire.");
    }
    if (googleError === "google") {
      setError("Connexion Google impossible.");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setError("Veuillez saisir votre email et votre mot de passe.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const auth = await apiPost<AuthResponse>("/api/auth/login", { email, password });
      saveSession(auth);
      router.push(getDashboardPath(auth.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container min-h-[80vh] flex items-center justify-center">
      <form className="card p-8 w-full max-w-md animate-slide-up" onSubmit={handleSubmit}>
        <span className="badge">بنة تونسية</span>
        <h1 className="section-title mt-4 mb-3">Connexion</h1>
        <p className="text-stone-600 mb-6">
          Connectez-vous pour retrouver votre panier, vos commandes et votre espace vendeur.
        </p>

        <label className="font-semibold">Email</label>
        <input
          className="input mt-2 mb-4"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@example.com"
        />

        <label className="font-semibold">Mot de passe</label>
        <input
          className="input mt-2 mb-4"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="********"
        />

        {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
        {message ? <p className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-800">{message}</p> : null}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          ou
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <a href={`${API_URL}/api/auth/google`} className="btn-secondary w-full">
          Continuer avec Google
        </a>
      </form>
    </main>
  );
}
