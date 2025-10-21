interface TextGradientProps {
    text: string;
    className?: string;
}

export default function TextGradient({ text, className = "" }: Readonly<TextGradientProps>) {
    return (
        <p
            className={`transition-colors bg-gradient-to-r from-foreground/[35%] via-foreground/90 to-foreground/[35%] bg-clip-text text-transparent ${className}`}
        >
            {text}
        </p>
    );
}
