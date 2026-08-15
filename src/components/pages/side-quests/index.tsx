import { PageTitle, Section } from "@/components/ui";
import { SIDE_QUESTS, SIDE_QUESTS_PAGE_HEADING } from "@/data";
import QuestList from "./sections/QuestList";

/**
 * Side quests page composition. Every quest renders from
 * `src/data/pages/side-quests.ts` — nothing here touches the database.
 */
export default function SideQuestsIndex() {
    return (
        <Section id="side-quests">
            {SIDE_QUESTS.length > 0 && (
                <PageTitle
                    title={SIDE_QUESTS_PAGE_HEADING.title}
                    subtitle={SIDE_QUESTS_PAGE_HEADING.subtitle}
                />
            )}
            <QuestList />
        </Section>
    );
}
