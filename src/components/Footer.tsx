import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-20 px-6 md:px-12 border-t border-on-surface/5 bg-surface-container-low">
      <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 max-w-[1600px] mx-auto">
        <div className="space-y-6">
          <span className="font-headline text-xl text-on-surface">
            Michael Hein
          </span>
          <p className="font-body text-sm tracking-wide text-on-surface-variant max-w-xs">
            Kunstobjekte & Fotografie
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div className="flex flex-col space-y-4">
            <span className="font-body text-xs tracking-widest uppercase text-on-surface font-bold">
              Entdecken
            </span>
            <Link
              href="/galerie"
              className="font-body text-sm tracking-wide uppercase text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Galerie
            </Link>
            <Link
              href="/ueber-mich"
              className="font-body text-sm tracking-wide uppercase text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Über mich
            </Link>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="font-body text-xs tracking-widest uppercase text-on-surface font-bold">
              Rechtliches
            </span>
            <Link
              href="/impressum"
              className="font-body text-sm tracking-wide uppercase text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="font-body text-sm tracking-wide uppercase text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-on-surface/5 max-w-[1600px] mx-auto">
        <p className="font-body text-[10px] tracking-widest uppercase text-on-surface-variant">
          © {new Date().getFullYear()} Michael Hein. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
