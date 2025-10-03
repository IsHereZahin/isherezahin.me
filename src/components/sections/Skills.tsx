"use client";

import Image from 'next/image';
import { useState } from 'react';
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

const skillImages: Record<string, string> = {
    "Figma": "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "JavaScript": "https://images.unsplash.com/photo-1687603917313-ccae1a289a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "Typescript": "https://images.unsplash.com/photo-1699885960867-56d5f5262d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "React": "https://images.unsplash.com/photo-1506526794364-ba711a0d97fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "CSS & SCSS": "https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "Tailwind": "https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "Bootstrap": "https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "Vue": "https://images.unsplash.com/photo-1506526794364-ba711a0d97fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "Next.js": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "REST APIs": "https://images.unsplash.com/photo-1669137084970-bbbc29db73b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "MySQL & PostgreSQL": "https://images.unsplash.com/photo-1662026911591-335639b11db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "Python": "https://images.unsplash.com/photo-1649180556628-9ba704115795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "PHP": "https://images.unsplash.com/photo-1649180556628-9ba704115795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "Laravel": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "Linux": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "Git & GitHub": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "Docker": "https://images.unsplash.com/photo-1662916367255-7334143889c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "Postman": "https://images.unsplash.com/photo-1669137084970-bbbc29db73b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "VSCode": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    // "ShadCN UI": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
};

interface HoverPosition {
    x: number | string;
    y: number | string;
    transform: string;
    isCentered?: boolean;
}

const skills: Record<string, string[]> = {
    "Design": ["Figma", "CSS & SCSS", "Tailwind", "Bootstrap", "ShadCN UI"],
    "Front-end": ["JavaScript", "Typescript", "React", "Next.js", "Vue"],
    "Back-end": ["Laravel", "REST APIs", "MySQL & PostgreSQL", "Python", "PHP"],
    "Other": ["Linux", "Git & GitHub", "Docker", "Postman", "VSCode"],
};

export default function Skills() {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0, transform: '' });
    const [isSectionHovered, setIsSectionHovered] = useState(false);

    const specialSkills = ["Figma", "Tailwind", "Typescript", "React", "Next.js", "Laravel", "REST APIs", "Docker"];

    const handleSkillHover = (skill: string, e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        const spaceAbove = rect.top;
        const showBelow = spaceAbove <= 200;

        if (isMobile) {
            setHoverPosition({
                x: '50%',
                y: '50%',
                transform: 'translate(-50%, -50%)',
                isCentered: true
            });
        } else {
            setHoverPosition({
                x: rect.left + rect.width / 2,
                y: showBelow ? rect.bottom : rect.top,
                transform: showBelow
                    ? 'translate(-50%, 10px)'
                    : 'translate(-50%, calc(-100% - 10px))',
                isCentered: false
            });
        }
        setHoveredSkill(skill);
    };

    const currentTransform = hoveredSkill
        ? hoverPosition.transform
        : `${hoverPosition.transform} scale(0.95)`;

    return (
        <Section id="skills">
            <div onMouseEnter={() => setIsSectionHovered(true)}
                onMouseLeave={() => setIsSectionHovered(false)}
            >
                <SectionHeader
                    title="Technical Expertise"
                    subtitle="Some of the languages, tools and concepts I have experience with."
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {Object.entries(skills).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="mb-4 font-semibold text-foreground">
                                {category}
                            </h3>
                            <ul className="space-y-2 text-[15px]">
                                {items.map(skill => (
                                    <li
                                        key={skill}
                                        className={`cursor-pointer transition-colors ${isSectionHovered && specialSkills.includes(skill)
                                                ? 'text-primary'
                                                : 'text-foreground/70 hover:text-foreground'
                                            }`}
                                        onMouseEnter={(e) => handleSkillHover(skill, e)}
                                        onMouseLeave={() => setHoveredSkill(null)}
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Hover Image Display */}
                <div
                    className="fixed pointer-events-none z-50 transition-all duration-200 ease-in-out"
                    style={{
                        left: typeof hoverPosition.x === 'number' ? `${hoverPosition.x}px` : hoverPosition.x,
                        top: typeof hoverPosition.y === 'number' ? `${hoverPosition.y}px` : hoverPosition.y,
                        transform: currentTransform,
                        opacity: hoveredSkill ? 1 : 0
                    }}
                >
                    {hoveredSkill && skillImages[hoveredSkill] && (
                        <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl shadow-feature-card">
                            <Image
                                src={skillImages[hoveredSkill]}
                                alt={hoveredSkill}
                                width={256}
                                height={192}
                                className="w-48 h-36 md:w-64 md:h-48 object-cover rounded-xl"
                                sizes="(max-width: 768px) 192px, 256px"
                            />
                            <div className="absolute -bottom-1 -left-1 bg-foreground text-background px-3 py-1 rounded-full text-xs">
                                {hoveredSkill}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}