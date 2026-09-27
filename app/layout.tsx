import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteWrapper } from "@/components/site-wrapper";

export const metadata: Metadata = {
  title: "Plásticos Bogotá | Soluciones en empaques",
  description: "Catálogo de bolsas y empaques plásticos. Servimos en Colombia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <SiteWrapper>{children}</SiteWrapper>
        </Providers>
      </body>
    </html>
  );
}
