import type { CalendarData, Habit } from "@/components/be-run/data";
import type { ContributionDay, GitHubData, GitHubRepoSummary } from "./useGitHub";

/** Format an integer with dot-thousands separators to match the dashboard style (e.g. 1283 -> "1.283"). */
export function fmtNum(n: number): string {
    return n.toLocaleString("de-DE");
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number) => String(n).padStart(2, "0");

// Colorful avatar gradients (matches the demo's varied look), cycled by index.
const GRADIENTS: [string, string][] = [
    ["#FBBF77", "#F0604D"],
    ["#C4B5FD", "#8B5CF6"],
    ["#7DD3FC", "#0EA5E9"],
    ["#86EFAC", "#16A34A"],
];

/**
 * Map GitHub contributions onto the Training-Days calendar for the current month,
 * preserving the card's exact visual language:
 *   done (yellow) = a high-activity day, scheduled (olive) = a lighter day,
 *   current (dark) = today.
 */
export function contributionsToCalendar(
    days: ContributionDay[],
    target: Date,
    currentDay: number | null,
): CalendarData {
    const year = target.getFullYear();
    const month = target.getMonth();
    const first = new Date(year, month, 1);
    const leadingBlanks = (first.getDay() + 6) % 7; // Monday-first offset
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const byDate = new Map(days.map((d) => [d.date, d]));
    const done: number[] = [];
    const scheduled: number[] = [];
    const counts: Record<number, number> = {};

    for (let d = 1; d <= daysInMonth; d++) {
        const c = byDate.get(`${year}-${pad(month + 1)}-${pad(d)}`);
        counts[d] = c?.count ?? 0;
        if (d === currentDay) continue; // keep today as the "current day" marker
        if (c && c.count > 0) {
            if (c.level >= 3) done.push(d);
            else scheduled.push(d);
        }
    }

    return {
        month: MONTHS[month],
        weekdays: ["M", "T", "W", "T", "F", "S", "S"],
        leadingBlanks,
        days: daysInMonth,
        done,
        scheduled,
        current: currentDay ? [currentDay] : [],
        counts,
    };
}

/**
 * Map top repositories onto the habit-row shape, preserving the exact list visual:
 *   title = repo name, subtitle = "Language: X", metric bars = stars vs the top repo.
 */
export function reposToHabits(repos: GitHubRepoSummary[]): Habit[] {
    const shown = repos.slice(0, 4);
    const maxStars = Math.max(1, ...shown.map((r) => r.stars));
    return shown.map((r, i) => ({
        id: r.name,
        name: r.name,
        role: "Language",
        person: r.language || "Other",
        completed: r.stars,
        total: maxStars,
        gradient: GRADIENTS[i % GRADIENTS.length],
    }));
}

/** GitHub Overview (blobs) card → repository stats: repos (dark pill), stars (yellow), forks (red). */
export function buildWorkout(d: GitHubData) {
    return {
        title: "GitHub Overview",
        primary: { value: fmtNum(d.profile.public_repos), unit: "repos" },
        blobA: { value: fmtNum(d.stars), unit: "stars" },
        blobB: { value: fmtNum(d.forks), unit: "forks" },
        legend: ["Stars", "Forks", "Repositories"] as [string, string, string],
    };
}
