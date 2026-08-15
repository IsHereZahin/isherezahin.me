import { PageTitle, Section } from "@/components/ui";
import { ATTRIBUTION_PAGE_HEADING } from "@/data";
import Credits from "./sections/Credits";

/**
 * Attribution page composition. Every section renders from
 * `src/data/pages/attribution.ts` — nothing here touches the database.
 */
export default function AttributionIndex() {
    return (
        <Section id="attribution">
            <PageTitle
                title={ATTRIBUTION_PAGE_HEADING.title}
                subtitle={ATTRIBUTION_PAGE_HEADING.subtitle}
            />
            <Credits />
        </Section>
    );
}
