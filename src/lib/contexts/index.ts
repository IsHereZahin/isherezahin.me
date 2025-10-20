// src/lib/contexts/index.ts
import { createContext } from "react";

interface AuthContextType {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    status: "loading" | "authenticated" | "unauthenticated";
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };
export type { AuthContextType };