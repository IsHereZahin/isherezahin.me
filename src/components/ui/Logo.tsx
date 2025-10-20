"use client";

import useTheme from "@/lib/hooks/useTheme";
import darkLogo from "../../../public/assets/images/darkLogo.png";
import lightLogo from "../../../public/assets/images/lightLogo.png";
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
    const theme = useTheme();

    // Choose the correct logo based on theme and type
    let logoSrc;
    const isDark = theme === "dark";

    switch (type) {
        case "header":
            logoSrc = isDark ? lightLogo : darkLogo;
            break;
        case "footer":
            logoSrc = isDark ? lightLogo : darkLogo;
            break;
        default:
            logoSrc = isDark ? darkLogo : lightLogo;
            break;
    }

    return (
        <div className={`flex items-center justify-center gap-1 font-medium ${className}`}>
            <BlurImage src={logoSrc} alt="logo" width={size} height={size} />
        </div>
    );
}