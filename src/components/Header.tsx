import Link from "next/link";

export default function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-nav">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-6">
        <Link
          href="/"
          className="font-headline text-2xl tracking-tighter text-on-surface"
        >
          Michael Hein
        </Link>
        <div className="hidden md:flex items-center space-x-10">
          <Link
            href="/galerie"
            className="font-headline tracking-tight text-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Galerie
          </Link>
          <Link
            href="/ueber-mich"
            className="font-headline tracking-tight text-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Über mich
          </Link>
        </div>
        <MobileMenu />
      </div>
    </nav>
  );
}

function MobileMenu() {
  return (
    <div className="md:hidden">
      <input type="checkbox" id="mobile-menu" className="hidden peer" />
      <label
        htmlFor="mobile-menu"
        className="cursor-pointer p-2 text-on-surface"
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
      <div className="fixed inset-0 bg-surface z-50 hidden peer-checked:flex flex-col items-center justify-center space-y-8">
        <label
          htmlFor="mobile-menu"
          className="absolute top-6 right-6 cursor-pointer p-2"
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
        <Link
          href="/"
          className="font-headline text-3xl text-on-surface"
        >
          Startseite
        </Link>
        <Link
          href="/galerie"
          className="font-headline text-3xl text-on-surface"
        >
          Galerie
        </Link>
        <Link
          href="/ueber-mich"
          className="font-headline text-3xl text-on-surface"
        >
          Über mich
        </Link>
      </div>
    </div>
  );
}
