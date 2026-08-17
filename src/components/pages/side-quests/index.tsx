import { PageTitle, Section } from "@/components/ui";
import type { SideQuestsContent } from "@/data/pages/side-quests";
import QuestList from "./sections/QuestList";

/** Side quests page composition. Copy comes from the active locale's dictionary. */
export default function SideQuestsIndex({ content }: { readonly content: SideQuestsContent }) {
    return (
        <Section id="side-quests">
            {content.items.length > 0 && (
                <PageTitle title={content.heading.title} subtitle={content.heading.subtitle} />
            )}
            <QuestList items={content.items} />
        </Section>
    );
}
