export interface DecorativeBlobProps {
    className?: string;
}

// Top blob (always at top)
export function DecorativeBlobTop({ className = "" }: Readonly<DecorativeBlobProps>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 550"
            preserveAspectRatio="xMidYMid meet"
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[250px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] ${className}`}
        >
            <g filter="url(#blob1-_S_1_)">
                <ellipse
                    cx="898.121"
                    cy="7.207"
                    rx="284.881"
                    ry="69.058"
                    fill="var(--blob1)"
                    fillOpacity=".43"
                />
            </g>
            <g filter="url(#blob2-_S_1_)">
                <ellipse
                    cx="727.789"
                    cy="48.819"
                    rx="284.881"
                    ry="131.671"
                    fill="var(--blob2)"
                    fillOpacity=".43"
                />
            </g>
            <g filter="url(#blob3-_S_1_)">
                <ellipse
                    cx="504.666"
                    cy="27.364"
                    rx="284.881"
                    ry="89.316"
                    fill="var(--blob3)"
                    fillOpacity=".43"
                />
            </g>
            <defs>
                <filter
                    id="blob1-_S_1_"
                    x="377.079"
                    y="-298.012"
                    width="1042.08"
                    height="610.439"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="118.081" result="gradient-background-blur" />
                </filter>
                <filter
                    id="blob2-_S_1_"
                    x="206.747"
                    y="-319.013"
                    width="1042.08"
                    height="735.665"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="118.081" result="gradient-background-blur" />
                </filter>
                <filter
                    id="blob3-_S_1_"
                    x="-16.376"
                    y="-298.113"
                    width="1042.08"
                    height="650.953"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="118.081" result="gradient-background-blur" />
                </filter>
            </defs>
        </svg>
    );
}

// Bottom blob (always at bottom)
export function DecorativeBlobBottom({ className = "" }: Readonly<DecorativeBlobProps>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 550"
            preserveAspectRatio="xMidYMid meet"
            className={`w-full max-w-[250px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] rotate-180 ${className}`}
        >
            <g filter="url(#blob1-_S_2_)">
                <ellipse cx="898.121" cy="7.207" rx="284.881" ry="69.058" fill="var(--blob1)" fillOpacity=".43" />
            </g>
            <g filter="url(#blob2-_S_2_)">
                <ellipse cx="727.789" cy="48.819" rx="284.881" ry="131.671" fill="var(--blob2)" fillOpacity=".43" />
            </g>
            <g filter="url(#blob3-_S_2_)">
                <ellipse cx="504.666" cy="27.364" rx="284.881" ry="89.316" fill="var(--blob3)" fillOpacity=".43" />
            </g>
            <defs>
                <filter id="blob1-_S_2_" x="377.079" y="-298.012" width="1042.08" height="610.439" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="118.081" result="gradient-background-blur" />
                </filter>
                <filter id="blob2-_S_2_" x="206.747" y="-319.013" width="1042.08" height="735.665" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="118.081" result="gradient-background-blur" />
                </filter>
                <filter id="blob3-_S_2_" x="-16.376" y="-298.113" width="1042.08" height="650.953" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="118.081" result="gradient-background-blur" />
                </filter>
            </defs>
        </svg>
    );
}