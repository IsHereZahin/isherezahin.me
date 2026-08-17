import { EmptyState, Section } from "@/components/ui";
import type { SideQuestsContent } from "@/data/pages/side-quests";
import QuestCard from "../components/QuestCard";

export default function QuestList({ items }: { readonly items: SideQuestsContent["items"] }) {
    if (items.length === 0) {
        return (
            <Section id="quests" animate delay={0.1}>
                <EmptyState type="quests" />
            </Section>
        );
    }

    return (
        <Section id="quests" animate delay={0.1}>
            <div className="space-y-16 sm:space-y-24">
                {items.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                ))}
            </div>
        </Section>
    );
}
