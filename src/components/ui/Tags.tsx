"use client";
interface TagsProps {
    tags: string[];
    className?: string;
    selected?: string[];
    clickableTags?: string[];
    onTagClick?: (tag: string) => void;
}

export default function Tags({
    tags,
    className,
    selected = [],
    clickableTags = [],
    onTagClick,
}: Readonly<TagsProps>) {
    return (
        <div className={`mt-4 sm:mt-6 flex flex-wrap items-baseline justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground ${className ?? ''}`}>
            <a
                href="#skip-tags"
                className="z-10 inline-block rounded-md px-1.5 py-0.5 font-medium transition bg-muted text-foreground hover:text-foreground focus:outline-none focus-visible:ring focus-visible:ring-primary disabled:cursor-not-allowed pointer-events-none absolute opacity-0 focus:inline-block translate-y-[-1rem] focus:translate-y-0 focus:opacity-100"
            >
                Skip tag
            </a>

            {tags.map((tag, index) => {
                const isSelected = selected.includes(tag);
                const isClickable = clickableTags.includes(tag);

                return (
                    <button
                        key={`${tag}-${index}`}
                        onClick={isClickable && onTagClick ? () => onTagClick(tag) : undefined}
                        className={`
                            inline-block rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 font-medium transition
                            ${isSelected
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'}
                            ${isClickable
                                ? 'cursor-pointer hover:text-foreground'
                                : 'cursor-not-allowed opacity-50'}
                            focus:outline-none focus-visible:ring focus-visible:ring-primary-300
                        `}
                        disabled={!isClickable}
                    >
                        {tag}
                    </button>
                );
            })}

            <div id="skip-tags" className="hidden" />
        </div>
    );
}