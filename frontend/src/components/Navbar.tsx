"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Menu, UserCircle, X } from "lucide-react";
import CartIcon from "@/components/CartIcon";
import { apiGet } from "@/lib/api";
import { getCurrentUser, getUserRole, isAuthenticated, UserRole } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [clientNotifications, setClientNotifications] = useState(0);

  useEffect(() => {
    const currentUser = getCurrentUser();
    const nextRole = getUserRole();
    setLoggedIn(isAuthenticated());
    setRole(nextRole);
    setProfileImageUrl(currentUser?.profileImageUrl || null);
    setOpen(false);

    if (nextRole === "CLIENT") {
      apiGet<{ count: number }>("/api/notifications/client/me/unread-count")
        .then((data) => setClientNotifications(data.count))
        .catch(() => setClientNotifications(0));
    } else {
      setClientNotifications(0);
    }
  }, [pathname]);

  const links = loggedIn
    ? [
        { href: "/dishes", label: "Plats", show: role === "CLIENT" },
        { href: "/formation", label: "Formations", show: role === "CLIENT" },
        { href: "/recipes", label: "Recettes", show: role === "CLIENT" },
        { href: "/orders", label: "Mes commandes", show: role === "CLIENT" },
        { href: "/seller/dashboard", label: role === "SELLER" ? "Espace vendeur" : "Devenir vendeur", show: role === "SELLER" || role === "CLIENT" },
        { href: "/admin/dashboard", label: "Espace admin", show: role === "ADMIN" },
      ].filter((link) => link.show)
    : [];

  const profileIcon = profileImageUrl ? (
    <img src={profileImageUrl} alt="Profil" className="h-6 w-6 rounded-full object-cover" />
  ) : (
    <UserCircle size={18} />
  );

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/85 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-xl font-extrabold text-stone-950">
          <img
            src="/logo.png"
            alt="بنة تونسية"
            className="h-12 w-12 rounded-full border border-red-900/20 object-cover shadow-md"
          />
          <span dir="rtl">بنة تونسية</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-stone-700 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition hover:text-red-900 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-red-800 after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              {role === "CLIENT" ? <CartIcon /> : null}
              {role === "CLIENT" ? (
                <Link href="/orders" className="btn-secondary relative flex items-center gap-2 py-2">
                  <Bell size={18} />
                  {clientNotifications > 0 ? (
                    <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-xs font-bold text-white">
                      {clientNotifications}
                    </span>
                  ) : null}
                </Link>
              ) : null}
              <Link href="/profile" className="btn-secondary flex items-center gap-2 py-2">
                {profileIcon}
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary py-2">Connexion</Link>
              <Link href="/register" className="btn-primary py-2">Creer compte</Link>
            </>
          )}
        </div>

        <button className="btn-secondary px-3 py-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-stone-200 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3 font-semibold">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="py-2">
                {link.label}
              </Link>
            ))}
            {loggedIn ? (
              <>
                {role === "CLIENT" ? <CartIcon /> : null}
                {role === "CLIENT" ? (
                  <Link href="/orders" className="btn-secondary relative flex items-center justify-center gap-2 py-2">
                    <Bell size={18} />
                    Notifications
                    {clientNotifications > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-xs font-bold text-white">
                        {clientNotifications}
                      </span>
                    ) : null}
                  </Link>
                ) : null}
                <Link href="/profile" className="btn-secondary flex items-center justify-center gap-2 py-2">
                  {profileIcon}
                  Profil
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-center py-2">Connexion</Link>
                <Link href="/register" className="btn-primary text-center py-2">Creer compte</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
