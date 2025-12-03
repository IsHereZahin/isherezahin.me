export interface TestimonialType {
    id: number;
    quote: string;
    name: string;
    role: string;
}

export default function Testimonial({ quote, name, role }: Readonly<TestimonialType>) {
    return (
        <blockquote className="pl-8 sm:pl-12 mt-6 sm:mt-10 group">
            <div className="relative">
                {/* Quote Icon */}
                <svg
                    className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/30 transform -translate-x-8 sm:-translate-x-12"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                </svg>

                {/* Quote text */}
                <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors leading-relaxed">{quote}</p>
            </div>

            {/* Footer */}
            <footer className="mt-2 sm:mt-3 text-sm sm:text-base text-secondary-foreground group-hover:text-primary transition-colors duration-200 ease-in-out">
                <span className="font-semibold text-foreground">{name}</span>{" "}
                <span className="font-normal text-muted-foreground">· {role}</span>
            </footer>
        </blockquote>
    );
}