import Attribution from "@/components/Attribution";
import PageTitle from '@/components/ui/PageTitle';
import Section from '@/components/ui/Section';

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