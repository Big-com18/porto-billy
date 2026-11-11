import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const font = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-main", display: "swap" });

export const metadata: Metadata = {
  title: "Billy Andreas — Front-End Developer",
  description: "Mahasiswa Ilmu Komputer & Front-End Developer dari Jakarta. Dream On.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
