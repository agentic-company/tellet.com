import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tellet — AI agents that run your business",
  description:
    "Describe your business, get an AI team that emails customers, schedules tasks, and delegates work to each other. Free to start.",
  openGraph: {
    title: "tellet — AI agents that run your business",
    description:
      "Describe your business, get an AI team that emails customers, schedules tasks, and delegates work to each other. Free to start.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
