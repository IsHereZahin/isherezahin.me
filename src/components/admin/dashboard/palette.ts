// Shared palette for the admin dashboard. Neutral surfaces resolve to the
// theme-aware `--s-*` tokens (globals.css) so they flip in dark mode; the gold
// and coral accents stay fixed across both themes.
export const D = {
    page: "var(--s-page)",     // page background
    dark: "var(--s-invert)",   // dark accent surface (active nav, dark card, buttons)
    darkSoft: "var(--s-invert2)",
    yellow: "#F4C63D",         // accent
    coral: "#EE5D4A",
    muted: "var(--s-muted)",
    cardBorder: "var(--s-border)",
} as const;

// Language dot/bar colors (GitHub's canonical language colors).
const LANG_COLORS: Record<string, string> = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
    "C++": "#f34b7d", C: "#555555", "C#": "#178600", HTML: "#e34c26", CSS: "#563d7c",
    PHP: "#4F5D95", Ruby: "#701516", Go: "#00ADD8", Rust: "#dea584", Dart: "#00B4AB",
    Shell: "#89e051", Vue: "#41b883", Kotlin: "#A97BFF", Swift: "#F05138", Svelte: "#ff3e00",
    Astro: "#ff5a03", SCSS: "#c6538c", Lua: "#000080", Elixir: "#6e4a7e",
};

export const langColor = (name: string | null | undefined) =>
    (name && LANG_COLORS[name]) || "#9A978F";
