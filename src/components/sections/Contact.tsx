import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

// components/Contact.tsx
export default function Contact() {
    return (
        <Section id="contact">
            <SectionHeader title="Contact" />

            <p className="text-[15px] text-muted-foreground leading-relaxed mb-2">
                Do you have a job opportunity or idea you'd like to discuss? Feel free to reach me at{" "}
                <a href="mailto:hello@delba.dev" className="underline hover:opacity-70 transition-opacity text-foreground">
                    hello@delba.dev
                </a>
                . You can also find me on{" "}
                <a href="#" className="underline hover:opacity-70 transition-opacity text-foreground">
                    Twitter
                </a>
                ,{" "}
                <a href="#" className="underline hover:opacity-70 transition-opacity text-foreground">
                    Github
                </a>
                ,{" "}
                <a href="#" className="underline hover:opacity-70 transition-opacity text-foreground">
                    and
                </a>{" "}
                <a href="#" className="underline hover:opacity-70 transition-opacity text-foreground">
                    LinkedIn
                </a>
                .
            </p>
        </Section>
    );
}