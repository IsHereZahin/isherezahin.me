interface HeadingProps {
    text: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    className?: string;
}

export default function Heading({
    text,
    size = "lg",
    className = "text-center",
}: Readonly<HeadingProps>) {
    const sizeClasses = {
        sm: "text-xl md:text-2xl",
        md: "text-2xl md:text-3xl",
        lg: "text-3xl md:text-5xl",
        xl: "text-4xl md:text-6xl",
        "2xl": "text-5xl md:text-7xl",
    }[size];

    return (
        <h1
            className={`${sizeClasses} bg-linear-to-b from-foreground via-foreground/90 to-foreground/70 to-90% bg-clip-text font-bold text-transparent md:leading-[64px] ${className}`}
        >
            {text}
        </h1>
    );
}