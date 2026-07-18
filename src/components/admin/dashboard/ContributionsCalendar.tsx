"use client";

import TrainingDays from "@/components/be-run/TrainingDays";
import { useMemo, useState } from "react";
import { contributionsToCalendar } from "./githubToCards";
import MonthDropdown, { type MonthOption } from "./MonthDropdown";
import type { ContributionDay } from "./useGitHub";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ContributionsCalendar({ days }: { days: ContributionDay[] }) {
    const now = new Date();
    const [value, setValue] = useState(`${now.getFullYear()}-${now.getMonth()}`);

    // Month options from the earliest contribution month through the current month (newest first).
    const options = useMemo<MonthOption[]>(() => {
        if (!days.length) return [];
        // The API's all-years array isn't guaranteed chronological, so find the true earliest date.
        let earliest = days[0].date;
        for (const d of days) if (d.date < earliest) earliest = d.date;
        const start = new Date(earliest + "T00:00:00Z");
        const opts: MonthOption[] = [];
        let y = start.getUTCFullYear();
        let m = start.getUTCMonth();
        const endY = now.getFullYear();
        const endM = now.getMonth();
        while (y < endY || (y === endY && m <= endM)) {
            opts.push({ value: `${y}-${m}`, label: `${MONTHS_SHORT[m]} ${y}` });
            m += 1;
            if (m > 11) {
                m = 0;
                y += 1;
            }
        }
        return opts.reverse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const [yStr, mStr] = value.split("-");
    const year = Number(yStr);
    const month = Number(mStr);
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    const currentDay = isCurrentMonth ? now.getDate() : null;

    const calendar = contributionsToCalendar(days, new Date(year, month, 1), currentDay);
    const label = `${MONTHS_SHORT[month]} ${year}`;

    return (
        <TrainingDays
            data={calendar}
            title="Contributions"
            legendLabels={["Today", "High activity", "Some activity"]}
            monthSelector={
                <MonthDropdown label={label} options={options} selected={value} onSelect={setValue} />
            }
        />
    );
}
