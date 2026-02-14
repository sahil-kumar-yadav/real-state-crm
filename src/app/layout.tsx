import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
