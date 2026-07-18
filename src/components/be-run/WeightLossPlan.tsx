import { C } from "./data";

interface WeightLossPlanProps {
    title?: string;
    /** Header percentage (0-100). */
    percent?: number;
    /** Word shown after the percentage. */
    suffix?: string;
    /** Thumb / fill position (0-100). */
    pct?: number;
    thumbLabel?: string;
    leftLabel?: string;
    rightLabel?: string;
}

export default function WeightLossPlan({
    title = "Weight Loss Plan",
    percent = 68,
    suffix = "Completed",
    pct = 60,
    thumbLabel = "53.2 kg",
    leftLabel = "58 kg",
    rightLabel = "50 kg",
}: WeightLossPlanProps) {
    const clamped = Math.max(0, Math.min(pct, 100));
    // Keep the thumb pill from clipping the card edges at the extremes.
    const thumbPos = Math.max(6, Math.min(clamped, 94));

    return (
        <div className="rounded-[24px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-start justify-between">
                <h3 className="text-[16px] font-semibold text-[#26262B]">{title}</h3>
                <div className="text-right leading-none">
                    <span className="text-[17px] font-bold text-[#26262B]">{percent}%</span>
                    <span className="ml-1 text-[12px] text-[#9a978f]">{suffix}</span>
                </div>
            </div>

            {/* Slider */}
            <div className="relative mt-10 mb-1">
                {/* Thumb pill */}
                <div
                    className="absolute -top-9 z-10 -translate-x-1/2"
                    style={{ left: `${thumbPos}%` }}
                >
                    <div
                        className="whitespace-nowrap rounded-lg px-2.5 py-1 text-[12px] font-semibold text-white shadow-md"
                        style={{ backgroundColor: C.dark }}
                    >
                        {thumbLabel}
                    </div>
                    <div
                        className="mx-auto h-2 w-2 -translate-y-1 rotate-45"
                        style={{ backgroundColor: C.dark }}
                    />
                </div>

                {/* Track */}
                <div className="relative h-2 rounded-full" style={{ backgroundColor: C.trackLight }}>
                    {/* Filled portion */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${clamped}%`, backgroundColor: C.dark }}
                    />
                    {/* Ticks on the remaining portion */}
                    <div
                        className="absolute inset-y-0 right-0 flex items-center justify-between"
                        style={{ left: `${clamped}%`, paddingLeft: 12, paddingRight: 4 }}
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <span
                                key={i}
                                className="h-1 w-1 rounded-full bg-[#cfcabf]"
                            />
                        ))}
                    </div>
                    {/* Knob */}
                    <div
                        className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow"
                        style={{ left: `${clamped}%`, backgroundColor: C.dark }}
                    />
                </div>

                {/* End labels */}
                <div className="mt-3 flex justify-between text-[12px] font-medium text-[#9a978f]">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            </div>
        </div>
    );
}
