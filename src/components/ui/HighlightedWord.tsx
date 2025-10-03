import { HighlightedWordProps } from "@/utils/types";

export default function HighlightedWord({ children, colorPrimary = "text-primary", strokeLight = "text-primary-300", strokeDark = "text-primary-400" }: Readonly<HighlightedWordProps>) {
    return (
        <span className={`relative block ${colorPrimary}`}>
            {children}
            <svg
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-6"
                viewBox="0 0 400 20"
                fill="none"
            >
                <path
                    d="M5 15C100 5 300 5 395 15"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={strokeLight}
                />
                <path
                    d="M5 10C150 2 250 2 395 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={strokeDark}
                />
            </svg>
        </span>
    );
}
