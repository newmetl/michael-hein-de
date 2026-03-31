import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-32 pb-28 md:pb-36">{children}</main>
      <Footer />
    </>
  );
}
