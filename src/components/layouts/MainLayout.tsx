import "@/app/styles/globals.css";
import { Header, SimpleFooter } from "@/components/layouts";
import { DecorativeBlobBottom, DecorativeBlobTop, Hello } from "@/components/ui";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex flex-col min-h-screen relative selection:bg-primary/20 selection:text-primary">
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