"use client";

import { useEffect, useState } from "react";
import darkLogo from "../../../public/assets/darkLogo.png";
import lightLogo from "../../../public/assets/lightLogo.png";
import BlurImage from "./BlurImage";

interface LogoProps {
    size?: number;
    className?: string;
    type?: "header" | "footer" | "normal";
}

export default function Logo({
    size = 40,
    className = "",
    type = "normal",
}: Readonly<LogoProps>) {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // initial check
        setDark(document.documentElement.classList.contains("dark"));

        return () => observer.disconnect();
    }, []);

    // Based on dark mode state, choose the correct logo
    let logoSrc;

    switch (type) {
        case "header":
            logoSrc = dark ? lightLogo : darkLogo;
            break;
        case "footer":
            logoSrc = dark ? lightLogo : darkLogo;
            break;
        default:
            logoSrc = dark ? darkLogo : lightLogo;
            break;
    }

    return (
        <div className={`flex items-center justify-center gap-1 font-medium ${className}`}>
            <BlurImage src={logoSrc} alt="logo" width={size} height={size} />
        </div>
    );
}
