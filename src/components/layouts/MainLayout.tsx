import "@/app/styles/globals.css";
import { SimpleFooter } from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { DecorativeBlobBottom, DecorativeBlobTop, Hello } from "@/components/ui";
import VisitorTracker from "@/components/VisitorTracker";
import { Suspense } from "react";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col min-h-screen relative selection:bg-primary/20 selection:text-primary">
            <Suspense fallback={null}>
                <VisitorTracker />
            </Suspense>
            <Hello />
            <Header />
            <DecorativeBlobTop />

            <main className="flex-1 relative z-10">
                {children}
            </main>

            <DecorativeBlobBottom className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0" />
            <SimpleFooter />
        </div>
    );
}