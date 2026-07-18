// Static mock data + shared palette for the Be.run health dashboard recreation.

export const C = {
    page: "#D9D4CC",       // warm greige behind the shell
    shell: "#F6F4EF",      // cream app surface
    workout: "#DCD6CA",    // tan workout-results card
    dark: "#26262B",       // near-black (nav active, dark card, buttons)
    darkSoft: "#3C3C43",   // lighter dark (current day)
    yellow: "#F4C63D",     // primary gold (done)
    blobYellow: "#FBD64E",
    coral: "#EE5D4A",      // calories burned / progress bars
    blobCoral: "#F0604D",
    olive: "#7C7748",      // scheduled
    trackLight: "#EFEAE1", // light gauge / slider track
    barEmpty: "#E6E2DA",   // empty equalizer bar
    muted: "#9A978F",      // muted text on cream
} as const;

export type Habit = {
    id: string;
    name: string;
    role: string;
    person: string;
    completed: number;
    total: number;
    gradient: [string, string];
};

export const habits: Habit[] = [
    { id: "stretch", name: "Stretching", role: "Trainer", person: "Alice McCain", completed: 9, total: 12, gradient: ["#FBBF77", "#F0604D"] },
    { id: "yoga", name: "Yoga training", role: "Trainer", person: "Jennifer Lubin", completed: 6, total: 10, gradient: ["#C4B5FD", "#8B5CF6"] },
    { id: "massage", name: "Massage", role: "Masseur", person: "Johnson Cooper", completed: 4, total: 8, gradient: ["#7DD3FC", "#0EA5E9"] },
    { id: "abs", name: "Ab exercises", role: "Trainer", person: "Marta Steward", completed: 8, total: 10, gradient: ["#86EFAC", "#16A34A"] },
];

export type CalendarData = {
    month: string;
    weekdays: string[];
    leadingBlanks: number;
    days: number;
    done: number[];
    scheduled: number[];
    current: number[];
    /** Optional per-day value (day number → count), used for hover tooltips. */
    counts?: Record<number, number>;
};

// June calendar. Two leading blanks so the 1st lands on Wednesday (matches the reference).
export const calendar: CalendarData = {
    month: "June",
    weekdays: ["M", "T", "W", "T", "F", "S", "S"],
    leadingBlanks: 2,
    days: 30,
    done: [1, 5],            // yellow
    scheduled: [14, 17, 19], // olive
    current: [23, 28],       // dark highlight
};

// Wave-like heights (px) for the habit equalizer bars.
export const BAR_HEIGHTS = [
    11, 14, 9, 16, 12, 18, 13, 10, 15, 12, 19, 14, 11, 17, 12, 9, 14, 11, 16, 13, 10, 15,
];
