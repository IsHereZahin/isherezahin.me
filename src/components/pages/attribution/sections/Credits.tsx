// NOTICE: If you are using the is-here-zahin.me project, please respect this attribution and do not remove or modify it.
// You are welcome to add additional credits if you extend or modify the project, but please retain this original attribution.

import { ReferralListItem, RichText, Section, Signature } from "@/components/ui";
import {
    ATTRIBUTION_INTRO,
    ATTRIBUTION_OUTRO,
    ATTRIBUTION_PEOPLE,
    ATTRIBUTION_TOOLS,
} from "@/data";

export default function Credits() {
    return (
        <Section id="credits" animate className="mt-[-50px] py-16 max-w-[700px]">
            {/* Header */}
            <h2 className="text-foreground text-2xl font-semibold mb-8">{ATTRIBUTION_INTRO.title}</h2>

            {/* Project overview, history and attribution philosophy */}
            {ATTRIBUTION_INTRO.paragraphs.map((paragraph, index) => (
                <div
                    key={paragraph}
                    className={`font-normal text-secondary-foreground leading-relaxed ${index === ATTRIBUTION_INTRO.paragraphs.length - 1 ? "mb-8" : "mb-6"}`}
                >
                    <RichText text={paragraph} />
                </div>
            ))}

            {/* Credited people */}
            <h3 className="text-foreground text-lg font-medium mb-4">{ATTRIBUTION_PEOPLE.title}</h3>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={ATTRIBUTION_PEOPLE.items} />
            </ul>

            {/* Technology stack */}
            <h3 className="text-foreground text-lg font-medium mb-4">{ATTRIBUTION_TOOLS.title}</h3>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={ATTRIBUTION_TOOLS.items} />
            </ul>

            {/* License notice */}
            <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                {ATTRIBUTION_OUTRO.license}
            </div>

            {/* Signature */}
            <p className="mb-8 font-bold">{ATTRIBUTION_OUTRO.signOff}</p>
            <div className="font-normal text-secondary-foreground mt-[-40px]">
                <Signature className="size-30" />
            </div>

            {/* Contact */}
            <div className="border-t border-border pt-8">
                <p className="text-sm text-secondary-foreground leading-relaxed">
                    {ATTRIBUTION_OUTRO.contact.lead}{" "}
                    <a
                        href={`mailto:${ATTRIBUTION_OUTRO.contact.email}`}
                        className="text-foreground font-medium hover:underline transition-opacity"
                    >
                        {ATTRIBUTION_OUTRO.contact.email}
                    </a>
                </p>
            </div>
        </Section>
    );
}
