import type { Locale } from "@/i18n/config";
import type { SVGProps } from "react";

/** Flags as inline SVG. Windows has no glyphs for the emoji ones. */

type FlagProps = SVGProps<SVGSVGElement> & { className?: string };

function Flag({ children, ...props }: FlagProps) {
    return (
        <svg viewBox="0 0 640 480" role="presentation" aria-hidden="true" {...props}>
            {children}
        </svg>
    );
}

const FLAGS: Record<Locale, (props: FlagProps) => React.ReactElement> = {
    // Stars omitted: unreadable at this size.
    en: (props) => (
        <Flag {...props}>
            <rect width="640" height="480" fill="#fff" />
            {[0, 2, 4, 6, 8, 10, 12].map((i) => (
                <rect key={i} y={(480 / 13) * i} width="640" height={480 / 13} fill="#b22234" />
            ))}
            <rect width="272" height={(480 / 13) * 7} fill="#3c3b6e" />
        </Flag>
    ),
    fr: (props) => (
        <Flag {...props}>
            <rect width="640" height="480" fill="#fff" />
            <rect width="213.3" height="480" fill="#002654" />
            <rect x="426.7" width="213.3" height="480" fill="#ed2939" />
        </Flag>
    ),
    es: (props) => (
        <Flag {...props}>
            <rect width="640" height="480" fill="#aa151b" />
            <rect y="120" width="640" height="240" fill="#f1bf00" />
        </Flag>
    ),
    de: (props) => (
        <Flag {...props}>
            <rect width="640" height="160" fill="#000" />
            <rect y="160" width="640" height="160" fill="#dd0000" />
            <rect y="320" width="640" height="160" fill="#ffce00" />
        </Flag>
    ),
    ru: (props) => (
        <Flag {...props}>
            <rect width="640" height="160" fill="#fff" />
            <rect y="160" width="640" height="160" fill="#0039a6" />
            <rect y="320" width="640" height="160" fill="#d52b1e" />
        </Flag>
    ),
};

export default function FlagIcon({
    locale,
    className = "",
}: {
    readonly locale: Locale;
    readonly className?: string;
}) {
    const Component = FLAGS[locale];
    return (
        <span
            className={`inline-block overflow-hidden rounded-[2px] ring-1 ring-black/10 dark:ring-white/15 ${className}`}
        >
            <Component className="block h-full w-full" />
        </span>
    );
}
