// src/lib/hooks/useTheme.ts
"use client";

import type { Theme } from "@giscus/react";
import { useEffect, useState } from "react";

export default function useTheme(): Theme {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const updateTheme = () => {
            setTheme(
                document.documentElement.classList.contains("dark") ? "dark" : "light"
            );
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // initial check
        updateTheme();

        return () => observer.disconnect();
    }, []);

    return theme;
}