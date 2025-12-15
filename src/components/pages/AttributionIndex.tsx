import Attribution from "@/components/Attribution";
import { PageTitle, Section } from "@/components/ui";

export default function AttributionIndex() {
    return (
        <Section id="attribution">
            <PageTitle
                title="Attribution"
                subtitle="Journey to create this personal portfolio."
            />
            <Attribution />
        </Section>
    )
}