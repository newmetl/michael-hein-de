"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <nav className="bg-inverse-surface text-white px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-headline text-lg">
            Admin
          </Link>
          <Link
            href="/admin/alben"
            className={`text-sm transition-colors ${
              isActive("/admin/alben")
                ? "text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Alben
          </Link>
          <Link
            href="/admin/seiten"
            className={`text-sm transition-colors ${
              isActive("/admin/seiten")
                ? "text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Seiten
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors"
            target="_blank"
          >
            Website ansehen
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>
    </nav>
  );
}
