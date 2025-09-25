import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Providers from "./providers";
import AppShell from "@/app/components/AppShell";
import CookieConsent from "./components/CookieConsent";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Done Deliveries",
  description: "Spring panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="bg-bg-light">
      <body>
        <Providers>
          <Navbar />
          <AppShell>{children}</AppShell>
        </Providers>
        <CookieConsent />
        <Footer />
      </body>
    </html>
  );
}
