// Shared palette for the admin dashboard (light, cream aesthetic).
export const D = {
    page: "#EDEBE5",       // cream page background
    dark: "#26262B",       // near-black (active nav, dark card, buttons)
    darkSoft: "#3C3C43",
    yellow: "#F4C63D",     // accent
    coral: "#EE5D4A",
    muted: "#9A978F",
    cardBorder: "#EEEAE2",
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
