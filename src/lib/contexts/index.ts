// src/lib/contexts/index.ts
"use client";

import { createContext } from "react";
import { ChatContextType } from "@/utils/types";
import { AuthContextType, DiscussionContextType } from "@/lib/github/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export { AuthContext, ChatContext, DiscussionContext };
