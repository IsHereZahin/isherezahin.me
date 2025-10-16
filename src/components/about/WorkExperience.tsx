import Image from "next/image";
import Section from "../ui/Section";

export default function WorkExperience() {
    const experiences = [
        {
            period: "2024 - Present",
            role: "Lead Designer at",
            company: "Aura",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            icon: "https://framerusercontent.com/images/q0xdE2yYRgZ8hX3M8z7ERx1WVZI.svg"
        },
        {
            period: "2022 - 2024",
            role: "Senior UI/UX Designer at",
            company: "Apple",
            bgColor: "bg-gray-200",
            textColor: "text-black",
            icon: "https://framerusercontent.com/images/I38nFLqsNFTrWk7rKoaRpGXyN08.svg"
        },
        {
            period: "2020 - 2022",
            role: "Product Designer at",
            company: "Shopify",
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            icon: "https://framerusercontent.com/images/Ocriu0NV3XWqyUahRxH3A8RgE.svg"
        }
    ];

    return (
        <Section id="work-experience" animate={true} delay={0.2}>
            <h2 className="text-4xl font-bold mb-12">Work Experience</h2>

            <div className="space-y-8">
                {experiences.map((exp, index) => (
                    <div key={index + 1} className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <div className="sm:w-32 flex-shrink-0">
                            <p className="text-gray-400 text-sm">{exp.period}</p>
                        </div>

                        <div className="flex-1 flex flex-col sm:flex-row items-start gap-3">
                            <p className="text-gray-600 text-sm whitespace-nowrap">{exp.role}</p>

                            <div className={`${exp.bgColor} ${exp.textColor} px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2`}>
                                <Image src={exp.icon} alt={exp.company} width={16} height={16} className="w-4 h-4" />
                                <span className="font-medium text-sm tracking-tight">{exp.company}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-8 text-secondary-foreground">This section is under construction. Will be updated soon...</p>
        </Section>
    );
}