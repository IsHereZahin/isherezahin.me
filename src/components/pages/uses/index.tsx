import { Section } from "@/components/ui";
import Hardware from "./sections/Hardware";
import Hero from "./sections/Hero";
import Peripherals from "./sections/Peripherals";
import Software from "./sections/Software";
import Subscriptions from "./sections/Subscriptions";

/**
 * Uses page composition. Every section renders from
 * `src/data/pages/uses.ts` — nothing here touches the database.
 */
export default function UsesIndex() {
    return (
        <Section id="uses" animate delay={0.1}>
            <Hero />
            <Hardware />
            <Peripherals />
            <Software />
            <Subscriptions />
        </Section>
    );
}
