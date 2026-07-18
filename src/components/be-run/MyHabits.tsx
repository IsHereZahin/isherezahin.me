import { MoreHorizontal, Plus } from "lucide-react";
import Avatar from "./Avatar";
import { BAR_HEIGHTS, C, habits as demoHabits, type Habit } from "./data";

function EqualizerBars({ completed, total }: { completed: number; total: number }) {
    const bars = BAR_HEIGHTS.slice(0, 16);
    const ratio = total > 0 ? completed / total : 0;
    const filled = Math.round(bars.length * Math.min(ratio, 1));
    return (
        <div className="flex h-6 shrink-0 items-center gap-[1.5px]">
            {bars.map((h, i) => (
                <span
                    key={i}
                    className="w-[2px] rounded-full"
                    style={{
                        height: h,
                        backgroundColor: i < filled ? C.coral : C.barEmpty,
                    }}
                />
            ))}
        </div>
    );
}

function HabitRow({
    habit,
    metricLabel,
    showTotal,
}: {
    habit: Habit;
    metricLabel: string;
    showTotal: boolean;
}) {
    return (
        <div className="flex items-center gap-2.5 py-3">
            <Avatar name={habit.person} gradient={habit.gradient} size={38} />

            <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[var(--s-text)]">
                    {habit.name}
                </p>
                <p className="truncate text-[12px] text-[var(--s-muted)]">
                    {habit.role}: {habit.person}
                </p>
            </div>

            <p className="hidden shrink-0 text-[12px] whitespace-nowrap text-[var(--s-muted)] lg:block">
                {metricLabel}:{" "}
                <span className="font-semibold text-[var(--s-text)]">
                    {habit.completed}{showTotal ? `/${habit.total}` : ""}
                </span>
            </p>

            <EqualizerBars completed={habit.completed} total={habit.total} />

            <button aria-label="Options" className="shrink-0 text-[var(--s-faint)] hover:text-[var(--s-text)]">
                <MoreHorizontal className="h-5 w-5" />
            </button>
        </div>
    );
}

interface MyHabitsProps {
    /** Rows to render. Defaults to the demo habits. */
    habits?: Habit[];
    metricLabel?: string;
    title?: string;
    /** Show the "/total" denominator after the metric value. */
    showTotal?: boolean;
    emptyLabel?: string;
}

export default function MyHabits({
    habits = demoHabits,
    metricLabel = "Sessions completed",
    title = "My Habits",
    showTotal = true,
    emptyLabel = "Nothing to show yet.",
}: MyHabitsProps) {
    return (
        <div className="flex flex-1 flex-col rounded-[24px] bg-[var(--s-card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[var(--s-text)]">{title}</h3>
                <button className="flex items-center gap-2 text-[13px] font-medium text-[var(--s-text)]">
                    Add New
                    <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: C.dark }}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </span>
                </button>
            </div>

            {/* Rows */}
            {habits.length === 0 ? (
                <p className="flex flex-1 items-center justify-center py-10 text-center text-[13px] text-[var(--s-muted)]">
                    {emptyLabel}
                </p>
            ) : (
                <div className="mt-2 divide-y divide-[var(--s-border-soft)]">
                    {habits.map((habit) => (
                        <HabitRow
                            key={habit.id}
                            habit={habit}
                            metricLabel={metricLabel}
                            showTotal={showTotal}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
