import Link from "next/link";
import { ChefHat, GraduationCap, ShoppingBag, Store } from "lucide-react";

const highlights = [
  { icon: <ShoppingBag />, title: "Plats maison", text: "Commandez des spécialités locales préparées par des vendeurs vérifiés." },
  { icon: <GraduationCap />, title: "Formations", text: "Apprenez les gestes, recettes et techniques directement auprès des chefs." },
  { icon: <Store />, title: "Espace vendeur", text: "Gérez votre catalogue, vos revenus et vos commandes dans un tableau clair." },
];

export default function HomePage() {
  return (
    <main>
      <section className="page-container grid min-h-[72vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-in">
          <span className="badge">Marketplace culinaire tunisienne</span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight text-stone-950 md:text-6xl">
            بنة تونسية
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-600">
            Achetez des plats faits maison, découvrez des formations culinaires et donnez aux vendeurs locaux un vrai espace de vente.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/dishes" className="btn-primary">Explorer les plats</Link>
            <Link href="/register" className="btn-secondary">Devenir vendeur</Link>
          </div>
        </div>
        <div className="elevated-image group relative animate-soft-float bg-stone-950">
          <img
            src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80"
            alt="Table de cuisine conviviale"
            className="image-zoom h-[360px] w-full object-cover opacity-95 md:h-[460px]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/75 via-transparent to-red-950/20" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950/90 to-transparent p-6 text-white">
            <div className="flex items-center gap-3">
              <ChefHat />
              <p className="font-bold">Cuisine locale, commandes simples, paiement à la livraison.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="card p-6 hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-3 text-red-900">{item.icon}</div>
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm text-stone-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
