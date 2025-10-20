import { MY_NAME, SITE_USER_LOGO } from "@/lib/constants";
import { ArrowDown } from "lucide-react";
import MotionWrapper from "../motion/MotionWrapper";
import BlurImage from "../ui/BlurImage";
import Button from "../ui/Button";
import ImageZoom from "../ui/ImageZoom";
import Section from "../ui/Section";

export default function ProfileHero() {
    return (
        <Section id="profile" animate={true}>
            <div className="flex flex-col justify-center items-start text-left">

                {/* Profile Picture: Zoom-in */}
                <MotionWrapper
                    delay={0.1}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {SITE_USER_LOGO && (
                        <div className="relative size-25 rounded-full overflow-hidden shadow-lg mb-8">
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
                <MotionWrapper
                    direction="top"
                    delay={0.2}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Hey, I’m <span className="text-primary">{MY_NAME}</span>. <br />
                        Coder & Thinker
                    </h1>
                </MotionWrapper>

                {/* Description: Fade + slight top */}
                <MotionWrapper
                    direction="top"
                    delay={0.3}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <p className="max-w-xl text-base text-muted-foreground mb-6">
                        I work with <b>React</b> & <b>Laravel</b> Ecosystem, and write to teach people
                        how to rebuild and redefine fundamental concepts through mental models.
                    </p>
                </MotionWrapper>

                {/* Buttons: Slide from bottom */}
                <MotionWrapper
                    direction="bottom"
                    delay={0.4}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-4">
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