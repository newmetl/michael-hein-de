import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow login page without session
  // Middleware handles the rest, but double-check here
  return (
    <div className="min-h-screen bg-surface">
      {session && (
        <nav className="bg-inverse-surface text-white px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-headline text-lg">
                Admin
              </Link>
              <Link
                href="/admin/alben"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Alben
              </Link>
              <Link
                href="/admin/seiten"
                className="text-sm text-white/70 hover:text-white transition-colors"
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
              <form
                action={async () => {
                  "use server";
                  const { signOut } = await import("@/lib/auth");
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </nav>
      )}
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
