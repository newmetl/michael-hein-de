"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex items-center w-full px-6 md:px-12 py-5 md:py-6">
        <Link
          href="/"
          className="font-headline text-xl md:text-2xl tracking-tighter text-on-surface"
        >
          Michael Hein
        </Link>
        <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
          <NavLink href="/" active={pathname === "/"}>
            Start
          </NavLink>
          <NavLink href="/galerie" active={pathname.startsWith("/galerie")}>
            Galerie
          </NavLink>
          <NavLink href="/ueber-mich" active={pathname === "/ueber-mich"}>
            Über mich
          </NavLink>
        </div>
        <Link
          href="/ueber-mich#kontakt"
          className="hidden md:inline-flex items-center gap-2 btn-primary text-sm !py-2 !px-5"
        >
          Kontakt
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </Link>
        <MobileMenu />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`font-body tracking-tight text-lg transition-colors border-b pb-1 ${
        active
          ? "text-secondary border-secondary font-medium"
          : "text-on-surface-variant border-transparent hover:text-on-surface"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileMenu() {
  return (
    <div className="md:hidden">
      <input type="checkbox" id="mobile-menu" className="hidden peer" />
      <label
        htmlFor="mobile-menu"
        className="cursor-pointer p-2 text-on-surface"
        aria-label="Menü öffnen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </label>
      <div className="fixed inset-0 bg-surface z-50 hidden peer-checked:flex flex-col items-center justify-center space-y-10">
        <label
          htmlFor="mobile-menu"
          className="absolute top-5 right-6 cursor-pointer p-2"
          aria-label="Menü schließen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </label>
        <Link href="/" className="font-headline text-2xl text-on-surface">
          Start
        </Link>
        <Link href="/galerie" className="font-headline text-2xl text-on-surface">
          Galerie
        </Link>
        <Link href="/ueber-mich" className="font-headline text-2xl text-on-surface">
          Über mich
        </Link>
        <Link href="/ueber-mich#kontakt" className="font-headline text-2xl text-secondary">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
