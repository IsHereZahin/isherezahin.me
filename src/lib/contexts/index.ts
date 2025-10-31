// src/lib/contexts/index.ts
"use client";

import { createContext } from "react";
import { AuthContextType, DiscussionContextType } from "@/lib/github/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export { AuthContext, DiscussionContext };
