import { Section } from "@/components/ui";
import type { UsesContent } from "@/data/pages/uses";
import Hardware from "./sections/Hardware";
import Hero from "./sections/Hero";
import Peripherals from "./sections/Peripherals";
import Software from "./sections/Software";
import Subscriptions from "./sections/Subscriptions";

/** Uses page composition. Copy comes from the active locale's dictionary. */
export default function UsesIndex({ content }: { readonly content: UsesContent }) {
    return (
        <Section id="uses" animate delay={0.1}>
            <Hero heading={content.heading} hero={content.hero} />
            <Hardware {...content.hardware} />
            <Peripherals {...content.peripherals} />
            <Software {...content.software} />
            <Subscriptions {...content.subscriptions} />
        </Section>
    );
}
