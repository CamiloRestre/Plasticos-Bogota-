import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Plásticos Bogotá | Soluciones en empaques",
  description: "Catálogo de bolsas y empaques plásticos. Servimos en Colombia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <ScrollProgress />
          <SiteHeader />
          {children}
          <SiteFooter />
          <BackToTop />
          <WhatsappFloat />
        </Providers>
      </body>
    </html>
  );
}
