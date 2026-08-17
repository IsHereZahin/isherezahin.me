// NOTICE: If you are using the is-here-zahin.me project, please respect this attribution and do not remove or modify it.
// You are welcome to add additional credits if you extend or modify the project, but please retain this original attribution.

import { ReferralListItem, RichText, Section, Signature } from "@/components/ui";
import type { AttributionContent } from "@/data/pages/attribution";

export default function Credits({
    intro,
    people,
    tools,
    outro,
}: Readonly<Omit<AttributionContent, "heading">>) {
    return (
        <Section id="credits" animate className="mt-[-50px] py-16 max-w-[700px]">
            {/* Header */}
            <h2 className="text-foreground text-2xl font-semibold mb-8">{intro.title}</h2>

            {/* Project overview, history and attribution philosophy */}
            {intro.paragraphs.map((paragraph, index) => (
                <div
                    key={paragraph}
                    className={`font-normal text-secondary-foreground leading-relaxed ${index === intro.paragraphs.length - 1 ? "mb-8" : "mb-6"}`}
                >
                    <RichText text={paragraph} />
                </div>
            ))}

            {/* Credited people */}
            <h3 className="text-foreground text-lg font-medium mb-4">{people.title}</h3>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={people.items} />
            </ul>

            {/* Technology stack */}
            <h3 className="text-foreground text-lg font-medium mb-4">{tools.title}</h3>
            <ul className="space-y-3 mb-12 ml-6">
                <ReferralListItem listItems={tools.items} />
            </ul>

            {/* License notice */}
            <div className="font-normal text-secondary-foreground mb-8 leading-relaxed">
                {outro.license}
            </div>

            {/* Signature */}
            <p className="mb-8 font-bold">{outro.signOff}</p>
            <div className="font-normal text-secondary-foreground mt-[-40px]">
                <Signature className="size-30" />
            </div>

            {/* Contact */}
            <div className="border-t border-border pt-8">
                <p className="text-sm text-secondary-foreground leading-relaxed">
                    {outro.contact.lead}{" "}
                    <a
                        href={`mailto:${outro.contact.email}`}
                        className="text-foreground font-medium hover:underline transition-opacity"
                    >
                        {outro.contact.email}
                    </a>
                </p>
            </div>
        </Section>
    );
}
