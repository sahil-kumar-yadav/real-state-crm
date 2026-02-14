import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Estate CRM - Professional Property Management",
  description:
    "Complete CRM solution for real estate agencies to manage properties, agents, leads, and commissions",
  keywords: [
    "Real Estate",
    "CRM",
    "Property Management",
    "Lead Management",
    "Real Estate Software",
  ],
  authors: [{ name: "Your Agency Name" }],
  openGraph: {
    title: "Real Estate CRM",
    description: "Professional property management solution",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
