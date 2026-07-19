import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, Button, ImageZoom, Section } from "@/components/ui";
import { MY_NAME, SITE_USER_LOGO } from "@/lib/constants";
import { ArrowDown } from "lucide-react";

export default function ProfileHero() {
    return (
        <Section id="profile" animate={true}>
            <div className="flex flex-col justify-center items-start text-left">

                {/* Profile Picture: Zoom-in */}
                <MotionWrapper delay={0.1} duration={0.6}>
                    {SITE_USER_LOGO && (
                        <div className="relative size-20 sm:size-25 rounded-full overflow-hidden shadow-lg mb-6 sm:mb-8">
                            <ImageZoom>
                                <BlurImage
                                    src={SITE_USER_LOGO}
                                    alt="Profile Photo"
                                    className="w-full h-full object-cover"
                                    width={500}
                                    height={500}

                                />
                            </ImageZoom>
                        </div>
                    )}
                </MotionWrapper>

                {/* Heading: Slide from top */}
                <MotionWrapper direction="top" delay={0.2} duration={0.6}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
                        Hey, I’m <span className="text-primary">{MY_NAME}</span>. <br />
                        Coder & Thinker
                    </h1>
                </MotionWrapper>

                {/* Description: Fade + slight top */}
                <MotionWrapper direction="top" delay={0.3} duration={0.6}>
                    <p className="max-w-xl text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors mb-4 sm:mb-6 leading-relaxed">
                        I work with <b className="text-foreground">React</b> & <b className="text-foreground">Laravel</b> Ecosystem, and write to teach people
                        how to rebuild and redefine fundamental concepts through mental models.
                    </p>
                </MotionWrapper>

                {/* Buttons: Slide from bottom */}
                <MotionWrapper direction="bottom" delay={0.4} duration={0.6}>
                    <div className="mt-4 sm:mt-8 flex gap-2 sm:gap-4 flex-wrap">
                        <Button
                            href="#about-me"
                            text="Learn More"
                            icon={<ArrowDown className="size-[70%] text-foreground" />}
                        />
                        <Button href="/about" text="More about me" />
                    </div>
                </MotionWrapper>
            </div>
        </Section>
    );
}