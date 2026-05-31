"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthResponse, saveSession } from "@/lib/auth";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const rawUser = params.get("user");

      if (!accessToken || !rawUser) {
        setError("Connexion Google impossible.");
        return;
      }

      const auth: AuthResponse = {
        accessToken,
        user: JSON.parse(rawUser) as AuthResponse["user"],
      };

      saveSession(auth);
      router.replace(auth.user.role === "SELLER" ? "/seller/dashboard" : "/");
    } catch {
      setError("Session Google invalide.");
    }
  }, [router]);

  return (
    <main className="page-container flex min-h-[80vh] items-center justify-center">
      <div className="card w-full max-w-md p-8 text-center animate-slide-up">
        <span className="badge">Google</span>
        <h1 className="mt-4 text-2xl font-extrabold">Connexion en cours</h1>
        <p className="mt-3 text-stone-600">
          {error || "Preparation de votre session بنة تونسية..."}
        </p>
        {error ? (
          <button type="button" className="btn-primary mt-6" onClick={() => router.replace("/login")}>
            Retour connexion
          </button>
        ) : null}
      </div>
    </main>
  );
}
