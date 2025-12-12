import MotionWrapper from "@/components/motion/MotionWrapper";
import { ReferralLink } from "@/components/ui";

interface ReferralItem {
    text: string;
}

interface ReferralListItemProps {
    listItems: ReferralItem[];
    animation?: boolean;
}

export default function ReferralListItem({
    listItems,
    animation = false,
}: Readonly<ReferralListItemProps>) {
    return (
        <>
            {listItems.map((item, idx) => {
                const parts = item.text.split(/(\([^)]+\)\[[^\]]+\])/g);

                const listContent = (
                    <li className="flex items-baseline">
                        <span className="mr-3 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary-foreground relative top-[-0.15em]"></span>
                        <span>
                            {parts.map((part, partIdx) => {
                                const match = part.match(/\(([^)]+)\)\[([^\]]+)\]/);
                                if (match) {
                                    const display = match[1];
                                    let url = match[2];
                                    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

                                    return (
                                        <ReferralLink
                                            key={partIdx + 1}
                                            href={url}
                                            className="font-medium underline decoration-secondary-foreground/20 text-foreground hover:decoration-primary transition-colors"
                                        >
                                            {display}
                                        </ReferralLink>
                                    );
                                }
                                return (
                                    <span className="text-muted-foreground hover:text-foreground transition-all duration-200" key={partIdx + 1}>
                                        {part}
                                    </span>
                                );
                            })}
                        </span>
                    </li>
                );

                // Conditionally wrap with MotionWrapper
                return animation ? (
                    <MotionWrapper key={idx + 1} delay={0.5 + idx * 0.1}>
                        {listContent}
                    </MotionWrapper>
                ) : (
                    <div key={idx + 1}>{listContent}</div>
                );
            })}
        </>
    );
}
