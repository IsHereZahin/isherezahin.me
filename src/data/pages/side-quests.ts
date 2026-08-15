// src/data/pages/side-quests.ts
//
// Content for the side quests page (`/side-quests`). Edit here — the sections
// in `src/components/pages/side-quests` only lay this out.
//
// Add an entry to `SIDE_QUESTS` for each quest. Videos take a full YouTube
// watch URL (`https://www.youtube.com/watch?v=…`) plus a `thumbnail`.

import type { PageHeading, QuestItem } from "../types";

export const SIDE_QUESTS_PAGE_HEADING: PageHeading = {
    title: "What's a Side Quest?",
    subtitle:
        'In real life, "SIDE QUEST" refers to any activity or experience that is not part of your main responsibilities or goals; for example, a hobby or skill, etc. While it is not mandatory, but it adds new color and experience to life.',
};

export const SIDE_QUESTS: QuestItem[] = [
    {
        id: "swimming",
        date: "Around 2009",
        title: "Swimming",
        location: "Cox’s Bazar, BD",
        description: `I was born on Maheshkhali, the only one hilly island in Bangladesh, part of the Cox’s Bazar district. My childhood was spent in the calm of the village, where ponds are part of everyday life. We had one at my grandfather’s house, and I used to bathe there all the time. My uncles tried to teach me to swim, but I was always scared. One afternoon, while my grandmother was washing clothes by the pond, I ran and jumped in like I always did it. But that day, I landed in the deep middle of the pond. I was shocked. I remembered the moves my uncles had shown me, I applyed thats tricks, and somehow made it back to the edge, gasping but alive. Then so many times I swim in the open sea at Cox’s Bazar. The point is, nothing’s really impossible, you just need that one brave moment to try.`,
        media: [
            {
                type: "image",
                src: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?w=800",
            },
            {
                type: "image",
                src: "https://images.unsplash.com/photo-1527439958599-d15f96255619?w=800",
            },
            {
                type: "video",
                src: "https://www.youtube.com/watch?v=Su-4BVbez3A",
                thumbnail: "https://images.unsplash.com/photo-1662238640575-8ec337062028?w=200",
            },
        ],
    },
];
