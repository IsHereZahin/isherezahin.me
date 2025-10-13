interface TextGradientProps {
    text: string;
    className?: string;
}

export default function TextGradient({ text, className = "" }: Readonly<TextGradientProps>) {
    return (
        <p
            className={`text-center max-w-2xl mx-auto
            bg-gradient-to-r from-foreground/80 via-foreground/40 to-foreground
            bg-clip-text text-transparent ${className}`}
        >
            {text}
        </p>
    );
}
