import MotionWrapper from "@/components/motion/MotionWrapper";
import ReferralLink from "./ReferralLink";

interface ReferralItem {
    text: string;
}

interface ReferralListItemProps {
    listItems: ReferralItem[];
}

export default function ReferralListItem({ listItems }: Readonly<ReferralListItemProps>) {
    return (
        <>
            {listItems.map((item, idx) => {
                const parts = item.text.split(/(\([^\)]+\)\[[^\]]+])/g);

                return (
                    <MotionWrapper key={idx + 1} delay={0.5 + idx * 0.1} viewport={{ once: true, amount: 0.2 }}>
                        <li className="flex items-start">
                            <span className="mr-3 mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary-foreground"></span>
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
                                    return <span className="text-secondary-foreground" key={partIdx + 1}>{part}</span>;
                                })}
                            </span>
                        </li>
                    </MotionWrapper>
                );
            })}
        </>
    );
}
