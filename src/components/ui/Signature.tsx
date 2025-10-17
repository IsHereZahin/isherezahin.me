"use client";

import { MY_NAME } from "@/lib/constants";
import { useEffect, useState } from "react";
import BlurImage from "./BlurImage";

export default function Signature() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        setDark(document.documentElement.classList.contains("dark"));

        return () => observer.disconnect();
    }, []);

    // Based on dark mode state, choose the correct logo
    const logoSrc = dark
        ? "https://res.cloudinary.com/dsh30sjju/image/upload/v1760704703/Gemini_Generated_Image_2bce652bce652bce-removebg-preview_gv9ega.png"
        : "https://res.cloudinary.com/dsh30sjju/image/upload/v1760704508/image_xvovtk.svg";

    return (
        <BlurImage
            src={logoSrc}
            alt={`Signature of ${MY_NAME}`}
            width={200}
            height={200}
            className="w-full h-auto object-contain"
        />
    );
}