import { CircleHelp } from "lucide-react";
import ReferralLink from "../ui/ReferralLink";
import Section from "../ui/Section";

export default function CurrentStatusCard() {
    return (
        <Section
            animate delay={0.2}
            id="current-status"
            className="px-4 sm:px-6 py-10 max-w-[1000px] mx-auto overflow-hidden"
        >
            <div className="shadow-feature-card px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 rounded-2xl flex flex-col md:flex-row items-center md:items-center justify-between gap-10 md:gap-14 backdrop-blur-sm transition-colors duration-300 hover:bg-muted/40 overflow-hidden">

                {/* Left Section — Icon + Title */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 w-full md:w-auto text-center sm:text-left flex-shrink-0">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/5 backdrop-blur-md shadow-feature-card before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-br before:from-background/10 before:via-foreground/20 before:to-background/10 before:-z-10 flex-shrink-0">
                        <CircleHelp className="w-6 h-6 text-foreground" strokeWidth={1.4} />
                    </div>
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground leading-snug break-words">
                        What I&apos;m up to now
                    </h4>
                </div>

                {/* Right Section — Content */}
                <article className="text-left">
                    <ul className="list-disc list-outside space-y-2 text-secondary-foreground leading-relaxed pl-5 marker:text-foreground break-words">
                        <li>
                            At <ReferralLink
                                href="http://www.iconicsolutionsbd.com"
                                className="text-primary font-semibold hover:text-primary transition-colors"
                            >
                                Iconic
                            </ReferralLink>, I’m working on a File Manager web application.
                        </li>
                        <li>
                            I also work on the frontend of a SaaS platform that will help real estate appraisers, making it simple and easy to use.
                        </li>
                        <li>
                            On the backend, I’m learning <ReferralLink
                                href="https://www.w3schools.com/nodejs/default.asp"
                                className="text-primary font-semibold hover:text-primary transition-colors"
                            >
                                Node.js
                            </ReferralLink> and <ReferralLink
                                href="https://expressjs.com/"
                                className="text-primary font-semibold hover:text-primary transition-colors"
                            >
                                Express.js
                            </ReferralLink>.
                        </li>
                        <li>
                            I also keep improving this website so it’s smooth, fast, and easy to use.
                        </li>
                    </ul>
                </article>
            </div>
        </Section>
    );
}
