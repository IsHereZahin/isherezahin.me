import MotionWrapper from "@/components/motion/MotionWrapper";
import {
    BlurImage,
    ImageZoom,
    PageTitle,
    ReferralLink,
    RichText,
    Section,
    Signature,
} from "@/components/ui";
import { ABOUT_PAGE_HEADING, ABOUT_PROFILE } from "@/data";

export default function Profile() {
    const { name, title, location, age, imageSrc, socials, paragraphs } = ABOUT_PROFILE;

    return (
        <Section id="about">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <PageTitle title={ABOUT_PAGE_HEADING.title} subtitle={ABOUT_PAGE_HEADING.subtitle} />

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* Left Column - Profile */}
                    <MotionWrapper
                        delay={0.2}
                        duration={0.6}
                        className="md:w-2/5 flex justify-center md:justify-start"
                    >
                        <div className="space-y-8">
                            {/* Profile Card */}
                            <div className="relative">
                                {imageSrc ? (
                                    <ImageZoom>
                                        <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm">
                                            <BlurImage src={imageSrc} alt={name} />

                                            {/* Social Media Badges */}
                                            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                                {age && (
                                                    <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
                                                        <span className="text-white text-sm font-medium">{age}</span>
                                                    </div>
                                                )}
                                                {socials.map(({ href, label, icon: Icon }) => (
                                                    <ReferralLink
                                                        key={label}
                                                        href={href}
                                                        aria-label={label}
                                                        className="bg-black/50 backdrop-blur-md rounded-full p-2"
                                                    >
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </ReferralLink>
                                                ))}
                                            </div>
                                        </div>
                                    </ImageZoom>
                                ) : (
                                    <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground">No image</span>
                                    </div>
                                )}

                                {/* Name & Title */}
                                <div className="mt-4 sm:mt-6 text-center md:text-left">
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{name}</h2>
                                    <p className="text-secondary-foreground text-base sm:text-lg">{title}</p>
                                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">{location}</p>
                                </div>
                            </div>
                        </div>
                    </MotionWrapper>

                    {/* Right Column - Philosophy */}
                    <div className="md:w-3/5 space-y-6 sm:space-y-8 text-base">
                        {paragraphs.map((paragraph) => (
                            <MotionWrapper key={paragraph} direction="right" delay={0.2}>
                                <p className="leading-relaxed text-muted-foreground hover:text-foreground/80 transition-colors">
                                    <RichText text={paragraph} />
                                </p>
                            </MotionWrapper>
                        ))}

                        <MotionWrapper direction="right" delay={0.2}>
                            {/* Signature */}
                            <div className="mt-[-40px]">
                                <Signature />
                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </Section>
    );
}
