import { ChevronDown } from "lucide-react";
import { calendar, C, type CalendarData } from "./data";

function dayStyle(day: number, data: CalendarData): React.CSSProperties | undefined {
    if (data.done.includes(day)) return { backgroundColor: C.yellow, color: C.dark };
    if (data.scheduled.includes(day)) return { backgroundColor: C.olive, color: "#fff" };
    if (data.current.includes(day)) return { backgroundColor: C.darkSoft, color: "#fff" };
    return undefined;
}

function contributionLabel(data: CalendarData, day: number): string {
    const count = data.counts?.[day] ?? 0;
    const noun = count === 1 ? "contribution" : "contributions";
    return `${count === 0 ? "No" : count} ${noun} on ${data.month} ${day}`;
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-white/55">{label}</span>
        </div>
    );
}

interface TrainingDaysProps {
    /** Calendar highlights. Defaults to the demo June data. */
    data?: CalendarData;
    title?: string;
    /** Legend labels in order: [current, done, scheduled]. */
    legendLabels?: [string, string, string];
    /** Replaces the static month button (e.g. an interactive month/year picker). */
    monthSelector?: React.ReactNode;
}

export default function TrainingDays({
    data = calendar,
    title = "Your Training Days",
    legendLabels = ["Current day", "Done", "Scheduled"],
    monthSelector,
}: TrainingDaysProps) {
    const cells: (number | null)[] = [
        ...Array.from({ length: data.leadingBlanks }, () => null),
        ...Array.from({ length: data.days }, (_, i) => i + 1),
    ];

    return (
        <div
            className="rounded-[26px] p-6 text-white"
            style={{ backgroundColor: C.dark }}
        >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold">{title}</h2>
                {monthSelector ?? (
                    <button className="flex items-center gap-1 text-[13px] text-white/70">
                        {data.month}
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-y-2 text-center">
                {data.weekdays.map((d, i) => (
                    <span key={i} className="text-[11px] font-medium text-white/35">
                        {d}
                    </span>
                ))}

                {/* Day cells */}
                {cells.map((day, i) => (
                    <div key={i} className="flex justify-center py-0.5">
                        {day !== null && (
                            <div className="group relative">
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] text-white/70${data.counts ? " transition-transform group-hover:scale-110" : ""}`}
                                    style={dayStyle(day, data)}
                                    aria-label={data.counts ? contributionLabel(data, day) : undefined}
                                >
                                    {day}
                                </span>
                                {data.counts && (
                                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 flex-col items-center group-hover:flex">
                                        <span className="whitespace-nowrap rounded-md border border-white/10 bg-[#0d1117] px-2.5 py-1 text-[11px] font-medium text-white shadow-xl">
                                            {contributionLabel(data, day)}
                                        </span>
                                        <span className="-mt-1 h-2 w-2 rotate-45 border-b border-r border-white/10 bg-[#0d1117]" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4">
                <LegendDot color="#9b9ba0" label={legendLabels[0]} />
                <LegendDot color={C.yellow} label={legendLabels[1]} />
                <LegendDot color={C.olive} label={legendLabels[2]} />
            </div>
        </div>
    );
}
