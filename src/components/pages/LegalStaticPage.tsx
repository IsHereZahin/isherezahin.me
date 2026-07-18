import MarkdownPreview from "@/components/content/discussions/MarkdownPreview";
import { Heading, Section, TextGradient } from "@/components/ui";
import type { LegalDoc } from "@/data/legal";

export default function LegalStaticPage({ doc }: { readonly doc: LegalDoc }) {
    return (
        <>
            <Section id="legal_header" animate className="px-6 pt-16 max-w-4xl">
                <Heading size="lg" className="mb-4 sm:mb-6 text-center" text={doc.title} />
                <TextGradient text={doc.subtitle} className="max-w-2xl mx-auto text-center" />
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Last updated: {doc.lastUpdated}
                </p>
            </Section>

            <Section id="legal_content" className="px-6 py-8 max-w-4xl">
                <div className="prose prose-invert max-w-none">
                    <MarkdownPreview content={doc.content} />
                </div>
            </Section>
        </>
    );
}
