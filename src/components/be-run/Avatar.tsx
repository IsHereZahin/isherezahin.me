interface AvatarProps {
    name: string;
    gradient: [string, string];
    size?: number;
    className?: string;
}

/** Gradient circle avatar with initials — stands in for a profile photo. */
export default function Avatar({ name, gradient, size = 40, className }: AvatarProps) {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none ${className ?? ""}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.34,
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
            aria-hidden
        >
            {initials}
        </div>
    );
}
