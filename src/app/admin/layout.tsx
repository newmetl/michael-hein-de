import { auth } from "@/lib/auth";
import Link from "next/link";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-surface">
      {session && <AdminNav />}
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
