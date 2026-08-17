// src/data/pages/side-quests.ts
//
// Structure for the side quests page: the media attached to each quest. The
// titles, places and stories live in `src/i18n/dictionaries`.
//
// Videos take a full YouTube watch URL plus a `thumbnail`.

import type { Dictionary } from "@/i18n/dictionaries/en";
import type { PageHeading, QuestItem, QuestMedia } from "../types";

const QUEST_MEDIA: { id: string; media: QuestMedia[] }[] = [
    {
        id: "swimming",
        media: [
            { type: "image", src: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?w=800" },
            { type: "image", src: "https://images.unsplash.com/photo-1527439958599-d15f96255619?w=800" },
            {
                type: "video",
                src: "https://www.youtube.com/watch?v=Su-4BVbez3A",
                thumbnail: "https://images.unsplash.com/photo-1662238640575-8ec337062028?w=200",
            },
        ],
    },
];

export interface SideQuestsContent {
    heading: PageHeading;
    items: QuestItem[];
}

export function getSideQuestsContent(dict: Dictionary): SideQuestsContent {
    const t = dict.sideQuests;

    return {
        heading: t.heading,
        items: QUEST_MEDIA.map((quest, index) => ({
            id: quest.id,
            media: quest.media,
            ...t.items[index],
        })),
    };
}
