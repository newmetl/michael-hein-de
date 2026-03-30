"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Falsches Passwort");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md p-12 bg-surface-container-lowest">
        <h1 className="font-headline text-3xl tracking-tighter mb-8">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2"
            >
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors text-on-surface"
            />
          </div>
          {error && (
            <p className="text-error text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary py-4 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
