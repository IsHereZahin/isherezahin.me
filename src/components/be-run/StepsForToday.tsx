import { Pencil } from "lucide-react";

type IconType = React.ComponentType<{ className?: string }>;

const R = 52;
const CIRC = 2 * Math.PI * R;

interface StepsAction {
    label: string;
    icon?: IconType;
    href?: string;
}

interface StepsForTodayProps {
    title?: string;
    subtitle?: string;
    centerLabel?: string;
    centerValue?: string;
    /** Small marker near the arc end. */
    marker?: string;
    /** Arc fill, 0..1. */
    progress?: number;
    action?: StepsAction;
}

export default function StepsForToday({
    title = "Steps for Today",
    subtitle = "Keep your body toned",
    centerLabel = "Goal",
    centerValue = "8.500",
    marker = "5.201",
    progress = 0.8,
    action = { label: "Change Goal", icon: Pencil },
}: StepsForTodayProps) {
    const ActionIcon = action.icon;
    const actionContent = (
        <>
            {action.label}
            {ActionIcon && <ActionIcon className="h-3.5 w-3.5 text-[#9a978f]" />}
        </>
    );

    return (
        <div className="flex items-center justify-between gap-4 rounded-[24px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Left: text */}
            <div className="flex h-full flex-col">
                <h3 className="text-[16px] font-semibold text-[#26262B]">{title}</h3>
                <p className="mt-1 text-[13px] text-[#9a978f]">{subtitle}</p>
                {action.href ? (
                    <a
                        href={action.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-7 flex items-center gap-1.5 text-[13px] font-medium text-[#26262B]"
                    >
                        {actionContent}
                    </a>
                ) : (
                    <button className="mt-7 flex items-center gap-1.5 text-[13px] font-medium text-[#26262B]">
                        {actionContent}
                    </button>
                )}
            </div>

            {/* Right: circular gauge */}
            <div className="relative h-[132px] w-[132px] shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <defs>
                        <linearGradient id="stepsGauge" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="55%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="60"
                        cy="60"
                        r={R}
                        fill="none"
                        stroke="#EFEAE1"
                        strokeWidth="11"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r={R}
                        fill="none"
                        stroke="url(#stepsGauge)"
                        strokeWidth="11"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        strokeDashoffset={CIRC * (1 - Math.max(0, Math.min(progress, 1)))}
                    />
                </svg>

                {/* Marker */}
                <span className="absolute right-2 top-1 text-[12px] font-semibold text-[#26262B]">
                    {marker}
                </span>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[11px] text-[#9a978f]">{centerLabel}</span>
                    <span className="text-[24px] font-bold leading-tight text-[#26262B]">
                        {centerValue}
                    </span>
                </div>
            </div>
        </div>
    );
}
