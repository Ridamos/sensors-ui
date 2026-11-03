import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sensors Dashboard",
  description: "Моніторинг давачів температури та диму (Next.js + NestJS)",
};

// Кореневий layout: усе, що тут, повторюється на кожній сторінці.
// Navbar стоїть над {children}, тому навігація є і на головній, і на графіках, і на логіні.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className="antialiased bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col p-6">{children}</main>
      </body>
    </html>
  );
}
