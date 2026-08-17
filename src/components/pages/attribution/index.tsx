import { PageTitle, Section } from "@/components/ui";
import type { AttributionContent } from "@/data/pages/attribution";
import Credits from "./sections/Credits";

/** Attribution page composition. Copy comes from the active locale's dictionary. */
export default function AttributionIndex({ content }: { readonly content: AttributionContent }) {
    return (
        <Section id="attribution">
            <PageTitle title={content.heading.title} subtitle={content.heading.subtitle} />
            <Credits {...content} />
        </Section>
    );
}
