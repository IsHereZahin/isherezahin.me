import "@/app/styles/globals.css";
import { SimpleFooter } from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { DecorativeBlobBottom, DecorativeBlobTop } from "@/components/ui/DecorativeBlob";
import Hello from "@/components/ui/Hello";

export default function MainLayout({ children, adminPage }: Readonly<{ children: React.ReactNode, adminPage?: boolean }>) {
    return (
        <div className="flex flex-col min-h-screen relative selection:bg-primary/20 selection:text-primary">
            <Hello />
            {adminPage ? (
                <Header adminPage={true} />
            ) : (
                <Header />
            )}
            <DecorativeBlobTop />

            <main className="flex-1 relative z-10">
                {children}
            </main>

            <DecorativeBlobBottom className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0" />
            <SimpleFooter />
        </div>
    );
}