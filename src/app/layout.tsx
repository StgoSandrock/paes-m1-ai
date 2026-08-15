import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "./overrides.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = { title: { default: "Savia M1", template: "%s · Savia M1" }, description: "Ensayos PAES M1 con práctica, corrección y análisis." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
