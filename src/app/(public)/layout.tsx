import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LenisProvider } from "@/components/shared/lenis-provider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LenisProvider>
      <div className="flex min-h-screen flex-col relative">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
