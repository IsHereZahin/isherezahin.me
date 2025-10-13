import { useId } from 'react'

type DecorativeBlobProps = React.ComponentProps<'svg'> & {
    className?: string
}

const Filter = (props: React.ComponentProps<'filter'>) => (
    <filter colorInterpolationFilters='sRGB' filterUnits='userSpaceOnUse' {...props}>
        <feFlood floodOpacity='0' result='BackgroundImageFix' />
        <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur result='gradient-background-blur' stdDeviation='118.081' />
    </filter>
)

export function DecorativeBlobTop(props: DecorativeBlobProps) {
    const { className, ...rest } = props

    const id = useId()
    const blob1 = `blob1-${id}`
    const blob2 = `blob2-${id}`
    const blob3 = `blob3-${id}`

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 550'
            preserveAspectRatio='xMidYMid meet'
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] ${className || ''}`}
            {...rest}
        >
            <g filter={`url(#${blob1})`}>
                <ellipse
                    cx='898.121'
                    cy='7.207'
                    rx='284.881'
                    ry='69.058'
                    fill='var(--blob1)'
                    fillOpacity='.43'
                />
            </g>
            <g filter={`url(#${blob2})`}>
                <ellipse
                    cx='727.789'
                    cy='48.819'
                    rx='284.881'
                    ry='131.671'
                    fill='var(--blob2)'
                    fillOpacity='.43'
                />
            </g>
            <g filter={`url(#${blob3})`}>
                <ellipse
                    cx='504.666'
                    cy='27.364'
                    rx='284.881'
                    ry='89.316'
                    fill='var(--blob3)'
                    fillOpacity='.43'
                />
            </g>
            <defs>
                <Filter id={blob1} x='377.079' y='-298.012' width='1042.08' height='610.439' />
                <Filter id={blob2} x='206.747' y='-319.013' width='1042.08' height='735.665' />
                <Filter id={blob3} x='-16.376' y='-298.113' width='1042.08' height='650.953' />
            </defs>
        </svg>
    )
}

export function DecorativeBlobBottom(props: DecorativeBlobProps) {
    const { className, ...rest } = props

    const id = useId()
    const blob1 = `blob1-${id}`
    const blob2 = `blob2-${id}`
    const blob3 = `blob3-${id}`

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 550'
            preserveAspectRatio='xMidYMid meet'
            className={`w-full max-w-[500px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] rotate-180 ${className || ''}`}
            {...rest}
        >
            <g filter={`url(#${blob1})`}>
                <ellipse cx='898.121' cy='7.207' rx='284.881' ry='69.058' fill='var(--blob1)' fillOpacity='.43' />
            </g>
            <g filter={`url(#${blob2})`}>
                <ellipse cx='727.789' cy='48.819' rx='284.881' ry='131.671' fill='var(--blob2)' fillOpacity='.43' />
            </g>
            <g filter={`url(#${blob3})`}>
                <ellipse cx='504.666' cy='27.364' rx='284.881' ry='89.316' fill='var(--blob3)' fillOpacity='.43' />
            </g>
            <defs>
                <Filter id={blob1} x='377.079' y='-298.012' width='1042.08' height='610.439' />
                <Filter id={blob2} x='206.747' y='-319.013' width='1042.08' height='735.665' />
                <Filter id={blob3} x='-16.376' y='-298.113' width='1042.08' height='650.953' />
            </defs>
        </svg>
    )
}