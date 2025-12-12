import { ReferralLink } from "@/components/ui";

interface ReferralTextProps {
    text: string;
    className?: string;
}

// Parse text with (display)[url] syntax into React elements
export default function ReferralText({ text, className }: Readonly<ReferralTextProps>) {
    const parts = text.split(/(\([^)]+\)\[[^\]]+\])/g);

    return (
        <span className={className}>
            {parts.map((part, idx) => {
                const match = part.match(/\(([^)]+)\)\[([^\]]+)\]/);
                if (match) {
                    const display = match[1];
                    let url = match[2];
                    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

                    return (
                        <ReferralLink
                            key={idx}
                            href={url}
                            className="font-medium underline decoration-secondary-foreground/20 text-foreground hover:decoration-primary transition-colors"
                        >
                            {display}
                        </ReferralLink>
                    );
                }
                return <span key={idx}>{part}</span>;
            })}
        </span>
    );
}
