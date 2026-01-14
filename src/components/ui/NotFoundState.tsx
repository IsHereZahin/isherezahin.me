"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { Home } from "lucide-react";
import Button from "./Button";
import Heading from "./Heading";

interface NotFoundStateProps {
    title?: string;
    message?: string;
    buttonText?: string;
    buttonHref?: string;
}

export default function NotFoundState({
    title = "Page Not Found",
    message = "The page you're looking for doesn't exist or has been removed.",
    buttonText = "Go Back Home",
    buttonHref = "/",
}: Readonly<NotFoundStateProps>) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <MotionWrapper delay={0.2}>
                <Heading text="404" size="2xl" />
            </MotionWrapper>

            <MotionWrapper delay={0.4}>
                <h2 className="text-2xl sm:text-3xl font-semibold text-secondary-foreground mb-4">
                    Oops! {title}
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">{message}</p>
            </MotionWrapper>

            <MotionWrapper delay={0.6}>
                <Button href={buttonHref} text={buttonText} icon={<Home className="h-4 w-4" />} />
            </MotionWrapper>
        </div>
    );
}
