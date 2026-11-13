import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const main = Manrope({ subsets: ["latin"], variable: "--font-main", display: "swap" });

export const metadata: Metadata = {
  title: "Billy Andreas — Front-End Developer",
  description: "Mahasiswa Ilmu Komputer & Front-End Developer dari Jakarta. Dream On.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${display.variable} ${main.variable}`}>
      <body>{children}</body>
    </html>
  );
}
