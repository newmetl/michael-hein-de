"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center">
      <h2 className="font-headline text-2xl tracking-tighter mb-4">
        Etwas ist schiefgelaufen
      </h2>
      <p className="text-on-surface-variant mb-8 text-sm">
        {error.message || "Ein unerwarteter Fehler ist aufgetreten."}
      </p>
      <button
        onClick={reset}
        className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-8 py-3 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
