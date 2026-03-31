import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-16 md:py-20 px-6 md:px-12 border-t border-on-surface/5 bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0 max-w-[1600px] mx-auto">
        <div className="space-y-4">
          <span className="font-headline text-xl text-on-surface">
            Michael Hein
          </span>
          <p className="font-body text-sm text-on-surface-variant max-w-xs leading-relaxed">
            Kunstobjekte & Fotografie
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 md:gap-x-16 gap-y-8">
          <div className="flex flex-col space-y-3">
            <span className="font-label text-xs tracking-widest uppercase text-on-surface font-semibold">
              Entdecken
            </span>
            <Link
              href="/galerie"
              className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Galerie
            </Link>
            <Link
              href="/ueber-mich"
              className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Über mich
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="font-label text-xs tracking-widest uppercase text-on-surface font-semibold">
              Rechtliches
            </span>
            <Link
              href="/impressum"
              className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-on-surface/5 max-w-[1600px] mx-auto">
        <p className="font-body text-xs tracking-widest uppercase text-on-surface-variant">
          &copy; {new Date().getFullYear()} Michael Hein. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
