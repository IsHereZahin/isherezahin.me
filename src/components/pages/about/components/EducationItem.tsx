import MotionWrapper from "@/components/motion/MotionWrapper";
import { ReferralLink } from "@/components/ui";
import type { EducationItem as EducationItemData } from "@/data/types";
import Image from "next/image";

/** Initials tile shown when an entry has no logo. */
function Monogram({ institution }: { readonly institution: string }) {
    const initials = institution
        .split(/\s+/)
        .map((word) => word[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-muted/40 shrink-0 flex items-center justify-center text-[0.6875rem] font-semibold text-muted-foreground"
        >
            {initials}
        </div>
    );
}

export default function EducationItem({
    start,
    end = "Present",
    degree,
    institution,
    institutionUrl,
    logo,
}: Readonly<EducationItemData>) {
    const InstitutionLabel = institutionUrl ? (
        <ReferralLink
            href={institutionUrl}
            className="text-[1.0625rem] font-semibold text-foreground tracking-tight"
        >
            {institution}
        </ReferralLink>
    ) : (
        <span className="text-[1.0625rem] font-semibold text-foreground tracking-tight">
            {institution}
        </span>
    );

    return (
        <MotionWrapper
            delay={0.2}
            className="flex items-center gap-4 py-5 border-b border-border/50 last:border-b-0"
        >
            {logo ? (
                <Image
                    src={logo}
                    alt={`${institution} logo`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-contain bg-muted/40 p-1.5 shrink-0"
                />
            ) : (
                <Monogram institution={institution} />
            )}
            <div className="flex-1 min-w-0">
                {InstitutionLabel}
                <p className="text-[0.8125rem] text-muted-foreground mt-0.5 truncate">{degree}</p>
            </div>
            {start && (
                <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
                    {start} - {end}
                </span>
            )}
        </MotionWrapper>
    );
}
