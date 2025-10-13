import "@/app/styles/globals.css";
import { MY_NAME } from "@/lib/constants";
import type { Metadata } from "next";

import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { DecorativeBlobBottom, DecorativeBlobTop } from "@/components/ui/DecorativeBlob";
import Hello from "@/components/ui/Hello";

export const metadata: Metadata = {
    title: `${MY_NAME} | Software Developer`,
    description:
        `${MY_NAME} is a Software Developer from Cox's Bazar, Bangladesh, specializing in building high-performance and elegant web applications using React, Node.js, Laravel, and other modern web technologies.`,
};

export default function MainLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen relative">
            <Hello />
            <Header />
            <DecorativeBlobTop />
            {children}
            <DecorativeBlobBottom className="absolute bottom-0 left-1/2 -translate-x-1/2" />
            <Footer />
        </div>
    );
}