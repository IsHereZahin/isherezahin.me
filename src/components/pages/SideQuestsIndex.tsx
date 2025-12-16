"use client";

import SideQuests from "@/components/SideQuests";
import { PageTitle, Section } from "@/components/ui";
import { quests as questsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function SideQuestsIndex() {
    const { data, isLoading } = useQuery({
        queryKey: ["quests"],
        queryFn: questsApi.getAll,
    });

    const hasQuests = !isLoading && data?.quests && data.quests.length > 0;

    return (
        <Section id="side-quests">
            {(isLoading || hasQuests) && (
                <PageTitle
                    title="What's a Side Quest?"
                    subtitle='In real life, "SIDE QUEST" refers to any activity or experience that is not part of your main responsibilities or goals; for example, a hobby or skill, etc. While it is not mandatory, but it adds new color and experience to life.'
                />
            )}
            <SideQuests />
        </Section>
    );
}
