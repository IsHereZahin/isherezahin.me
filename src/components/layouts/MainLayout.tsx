import "@/app/styles/globals.css";
import { SimpleFooter } from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import MainShell from "@/components/layouts/MainShell";
import { DecorativeBlobBottom, DecorativeBlobTop, Hello } from "@/components/ui";
import VisitorTracker from "@/components/VisitorTracker";
import { KnowledgeGraphJsonLd } from "@/components/seo/JsonLd";
import { Suspense } from "react";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <MainShell
            extras={
                <>
                    <KnowledgeGraphJsonLd />
                    <Suspense fallback={null}>
                        <VisitorTracker />
                    </Suspense>
                    <Hello />
                </>
            }
            header={<Header />}
            top={<DecorativeBlobTop />}
            bottom={
                <DecorativeBlobBottom className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0" />
            }
            footer={<SimpleFooter />}
        >
            {children}
        </MainShell>
    );
}
