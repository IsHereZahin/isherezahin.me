// src/lib/hooks/useDiscussion.ts
import { DiscussionContext } from "@/lib/contexts";
import { useContext } from "react";

export const useDiscussion = () => {
    const context = useContext(DiscussionContext);
    if (!context) {
        throw new Error("useDiscussion must be used within DiscussionProvider");
    }
    return context;
};