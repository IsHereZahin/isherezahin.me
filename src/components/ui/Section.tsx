import { ReactNode } from "react";

export interface SectionProps {
    id: string;
    children: ReactNode;
}

export default function Section({ id, children }: Readonly<SectionProps>) {
    return (
        <section id={id} className="max-w-[900px] mx-auto px-6 py-16 relative">
            {children}
        </section>
    );
}