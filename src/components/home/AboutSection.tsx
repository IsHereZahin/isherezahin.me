import StacksCard from "@/components/about/StacksCard";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { BlurImage, ImageZoom } from "@/components/ui";
import { MY_NAME, SITE_USER_LOGO } from "@/lib/constants";
import Image from "next/image";
import React from "react";

// Tag Component 
export interface TagProps {
    text: string;
}
export const Tag: React.FC<TagProps> = ({ text }) => (
    <span className="inline-block border border-border rounded-md px-4 py-2 text-base text-foreground/80">
        {text}
    </span>
);

// GoalItem Component 
export interface GoalItemProps {
    text: string;
    done?: boolean;
}
export const GoalItem: React.FC<GoalItemProps> = ({ text, done = false }) => (
    <div className="flex items-center gap-2 border border-border rounded-lg bg-muted p-2">
        <div
            className={`w-4 h-4 rounded-full border border-border flex-shrink-0 ${done ? "bg-secondary-foreground" : "bg-background/80"}`}
        ></div>
        <p className={`text-sm ${done ? "line-through text-secondary-foreground" : "text-foreground/90"}`}>
            {text}
        </p>
    </div>
);

// ProfileCard Component 
export const ProfileCard: React.FC = () => (
    <div className="shadow-feature-card rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
        <div className="relative size-36 rounded-xl overflow-hidden">
            <div className="shadow-feature-card relative size-full overflow-hidden mb-8">
                {SITE_USER_LOGO && (
                    <ImageZoom>
                        <BlurImage src={SITE_USER_LOGO} alt="Profile Photo" />
                    </ImageZoom>
                )}
            </div>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
            <Tag text="Software Developer" />
            <Tag text="2+ years experience" />
        </div>
        <p className="text-foreground text-xl font-semibold">
            {MY_NAME} is a web-based Software Developer from Cox&apos;s Bazar, Bangladesh, specializing in building high-performance, elegant web applications using React, Vue, Laravel, and other modern web technologies.
        </p>
    </div>
);

// ProcessStep Component 
export interface ProcessStepProps {
    title: string;
    icon: React.ReactNode;
}
export const ProcessStep: React.FC<ProcessStepProps> = ({ title, icon }) => (
    <button className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 bg-muted text-foreground/80 backdrop-blur-sm transition">
        {icon}
        {title}
    </button>
);

// CardHeadline Component 
export interface CardHeadlineProps {
    title: string;
    subtitle: string;
}
export const CardHeadline: React.FC<CardHeadlineProps> = ({ title, subtitle }) => (
    <div className="mt-2">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-secondary-foreground opacity-70">{subtitle}</p>
    </div>
);

// ProcessCard Component 
export const ProcessCard: React.FC = () => (
    <div className="shadow-feature-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
            <ProcessStep
                title="Research"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx={11} cy={11} r={8} />
                        <line x1={21} y1={21} x2={16.65} y2={16.65} />
                    </svg>
                }
            />
            <ProcessStep
                title="Planning"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x={3} y={3} width={7} height={7} />
                        <rect x={14} y={3} width={7} height={7} />
                        <rect x={14} y={14} width={7} height={7} />
                        <rect x={3} y={14} width={7} height={7} />
                    </svg>
                }
            />
            <ProcessStep
                title="Design"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                    </svg>
                }
            />
            <ProcessStep
                title="Development"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7" />
                    </svg>
                }
            />
        </div>
        <CardHeadline title="My process" subtitle="My design process of making good design" />
    </div>
);

// GoalsCard Component 
export const GoalsCard: React.FC = () => (
    <div className="shadow-feature-card rounded-2xl p-4 flex flex-col gap-2">
        <GoalItem text="Get a new long-term client" done />
        <GoalItem text="Travel to China this year" />
        <GoalItem text="Build and sell my first template" />
        <CardHeadline title="My next goals" subtitle="A few things I'm aiming for." />
    </div>
);

// ImageCard Component 
export const ImageCard: React.FC = () => (
    <div className="shadow-feature-card rounded-2xl overflow-hidden">
        {SITE_USER_LOGO && (
            <Image src={SITE_USER_LOGO} alt="Plane wing" width={500} height={500} className="w-full h-full object-cover" />
        )}
    </div>
);

// AboutSection Component 
const AboutSection: React.FC = () => (
    <MotionWrapper
        direction="top"
        delay={0.2}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ProfileCard />
            </div>
            <div className="lg:col-span-1">
                <ProcessCard />
            </div>
            <StacksCard />
            <GoalsCard />
            <ImageCard />
        </div>
    </MotionWrapper>
);

export default AboutSection;