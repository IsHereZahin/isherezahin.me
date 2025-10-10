import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { DecorativeBlobBottom, DecorativeBlobTop } from "@/components/ui/DecorativeBlob";
import { MY_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Hello from "@/components/Hello";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${MY_NAME} | Software Developer`,
  description:
    `${MY_NAME} is a Software Developer from Cox's Bazar, Bangladesh, specializing in building high-performance and elegant web applications using React, Node.js, Laravel, and other modern web technologies.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background relative">
          <Hello />
          <Header />
          <DecorativeBlobTop />
          {children}
          <DecorativeBlobBottom className="absolute bottom-0 left-1/2 -translate-x-1/2" />
          <Footer />
        </div>
      </body>
    </html>
  );
}