import { EmptyState, Section } from "@/components/ui";
import { SIDE_QUESTS } from "@/data";
import QuestCard from "../components/QuestCard";

export default function QuestList() {
    if (SIDE_QUESTS.length === 0) {
        return (
            <Section id="quests" animate delay={0.1}>
                <EmptyState type="quests" />
            </Section>
        );
    }

    return (
        <Section id="quests" animate delay={0.1}>
            <div className="space-y-16 sm:space-y-24">
                {SIDE_QUESTS.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                ))}
            </div>
        </Section>
    );
}
