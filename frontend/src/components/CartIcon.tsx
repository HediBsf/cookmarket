"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartCount } from "@/lib/cart";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const interval = setInterval(() => setCount(getCartCount()), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex rounded-lg border border-stone-300 bg-white/85 p-3 text-red-900 shadow-sm transition hover:border-red-800/30 hover:bg-amber-50" aria-label="Panier">
      <ShoppingCart size={20} />
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
