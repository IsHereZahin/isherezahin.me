import { Flame } from "lucide-react";
import { C } from "./data";

type IconType = React.ComponentType<{ className?: string }>;

interface Stat {
    value: string;
    unit: string;
}

function LegendRow({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className="h-1.5 w-6 rounded-full"
                style={{ backgroundColor: color }}
            />
            <span className="text-[13px] text-[var(--s-text2)]">{label}</span>
        </div>
    );
}

interface WorkoutResultsProps {
    title?: string;
    icon?: IconType;
    /** Dark round pill (headline). */
    primary?: Stat;
    /** Big yellow blob. */
    blobA?: Stat;
    /** Smaller red blob. */
    blobB?: Stat;
    /** Legend labels in order: [yellow, red, dark]. */
    legend?: [string, string, string];
}

export default function WorkoutResults({
    title = "Your Workout Results for Today",
    icon: Icon = Flame,
    primary = { value: "2.30", unit: "hours" },
    blobA = { value: "1.875", unit: "kcal" },
    blobB = { value: "850", unit: "kcal" },
    legend = ["Calories intake", "Calories burned", "Activity time"],
}: WorkoutResultsProps) {
    return (
        <div
            className="relative overflow-hidden rounded-[26px] p-6 md:p-7"
            style={{ backgroundColor: C.workout }}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <h2 className="max-w-[195px] text-[17px] font-semibold leading-snug text-[var(--s-text)]">
                    {title}
                </h2>
                <button
                    aria-label="Details"
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: C.dark }}
                >
                    <Icon className="h-4 w-4 text-[#F4C63D]" />
                </button>
            </div>

            {/* Chart area */}
            <div className="relative mt-3 h-[230px]">
                {/* Soft blurred blobs */}
                <div
                    className="absolute right-6 top-1 h-[196px] w-[196px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle at 42% 34%, #FDE58A 0%, #FBD24C 55%, #F3C133 100%)",
                        filter: "blur(4px)",
                    }}
                />
                <div
                    className="absolute right-[118px] top-[92px] h-[132px] w-[132px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle at 40% 38%, #F58C6E 0%, #F0604D 60%, #E8493A 100%)",
                        filter: "blur(4px)",
                        opacity: 0.95,
                    }}
                />

                {/* Crisp overlay: dark pill + value labels */}
                <div
                    className="absolute left-[150px] top-[42px] flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: C.dark }}
                >
                    <span className="text-[17px] font-semibold leading-none">{primary.value}</span>
                    <span className="mt-1 text-[11px] text-white/70">{primary.unit}</span>
                </div>

                <div className="absolute right-[52px] top-[74px] text-center">
                    <span className="text-[19px] font-bold text-[#3a3320]">{blobA.value}</span>
                    <span className="ml-1 text-[13px] font-medium text-[#3a3320]/70">
                        {blobA.unit}
                    </span>
                </div>

                <div className="absolute right-[150px] top-[150px] text-center">
                    <span className="block text-[18px] font-bold leading-none text-white">
                        {blobB.value}
                    </span>
                    <span className="text-[12px] text-white/80">{blobB.unit}</span>
                </div>

                {/* Legend */}
                <div className="absolute bottom-1 left-1 space-y-3">
                    <LegendRow color={C.blobYellow} label={legend[0]} />
                    <LegendRow color={C.blobCoral} label={legend[1]} />
                    <LegendRow color={C.dark} label={legend[2]} />
                </div>
            </div>
        </div>
    );
}
