import { MY_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${MY_NAME} | Software Developer`,
  description:
    `${MY_NAME} is a Software Developer from Cox's Bazar, Bangladesh, specializing in building high-performance and elegant web applications using React, Node.js, Laravel, and other modern web technologies.`,
};

export default function MainRootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background">
        {children}
      </body>
    </html>
  );
}