import "@/app/styles/globals.css";
import { SimpleFooter } from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { DecorativeBlobBottom, DecorativeBlobTop } from "@/components/ui/DecorativeBlob";
import Hello from "@/components/ui/Hello";

export default function MainLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen relative">
            <Hello />
            <Header />
            <DecorativeBlobTop />
            {children}
            <DecorativeBlobBottom className="absolute bottom-0 left-1/2 -translate-x-1/2" />
            <SimpleFooter />
        </div>
    );
}