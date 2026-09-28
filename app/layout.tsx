import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteWrapper } from "@/components/site-wrapper";

export const metadata: Metadata = {
  title: "Plásticos Bogotá | Soluciones en empaques",
  description: "Catálogo de bolsas y empaques plásticos. Servimos en Colombia.",
  openGraph: {
    title: "Plásticos Bogotá | Soluciones en empaques",
    description: "Catálogo de bolsas y empaques plásticos. Servimos en Colombia.",
    type: "website",
    locale: "es_CO",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
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
