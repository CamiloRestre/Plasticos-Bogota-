import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteWrapper } from "@/components/site-wrapper";
import { Open_Sans, Poppins } from "next/font/google";

const displayFont = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });
const bodyFont = Open_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });

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
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <Providers>
          <SiteWrapper>{children}</SiteWrapper>
        </Providers>
      </body>
    </html>
  );
}
