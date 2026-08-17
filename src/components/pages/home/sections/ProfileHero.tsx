import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Button, ImageZoom, RichText, Section } from "@/components/ui";
import type { HomeContent } from "@/data/pages/home";
import { ArrowDown } from "lucide-react";

export default function ProfileHero({
    avatar,
    headingLead,
    name,
    headingTrail,
    description,
    actions,
}: Readonly<HomeContent["profileHero"]>) {
    return (
        <Section id="profile" animate={true}>
            <div className="flex flex-col justify-center items-start text-left">

                {/* Profile Picture: Zoom-in */}
                <MotionWrapper delay={0.1} duration={0.6}>
                    {avatar && (
                        <div className="relative size-20 sm:size-25 rounded-full overflow-hidden shadow-lg mb-6 sm:mb-8">
                            <ImageZoom>
                                {/* Above the fold and usually the LCP element:
                                    load it eagerly, and cap the fetched size to
                                    what the 80–100px frame actually needs. */}
                                <BlurImage
                                    src={avatar}
                                    alt="Profile Photo"
                                    className="w-full h-full object-cover"
                                    width={200}
                                    height={200}
                                    sizes="100px"
                                    lazy={false}
                                />
                            </ImageZoom>
                        </div>
                    )}
                </MotionWrapper>

                {/* Heading: Slide from top */}
                <MotionWrapper direction="top" delay={0.2} duration={0.6}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
                        {headingLead} <span className="text-primary">{name}</span>. <br />
                        {headingTrail}
                    </h1>
                </MotionWrapper>

                {/* Description: Fade + slight top */}
                <MotionWrapper direction="top" delay={0.3} duration={0.6}>
                    <p className="max-w-xl text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors mb-4 sm:mb-6 leading-relaxed">
                        <RichText text={description} />
                    </p>
                </MotionWrapper>

                {/* Buttons: Slide from bottom */}
                <MotionWrapper direction="bottom" delay={0.4} duration={0.6}>
                    <div className="mt-4 sm:mt-8 flex gap-2 sm:gap-4 flex-wrap">
                        {actions.map((action) => (
                            <Button
                                key={action.href}
                                href={action.href}
                                text={action.text}
                                icon={action.arrow ? <ArrowDown className="size-[70%] text-foreground" /> : undefined}
                            />
                        ))}
                    </div>
                </MotionWrapper>
            </div>
        </Section>
    );
}
