import { availableThemes } from "@/data";

function getRandomTheme(title: string): ThemeColor {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const index = Math.abs(hash) % availableThemes.length;
    return availableThemes[index];
}

function generateProfessionalUnderline(seed: string, height = 10, width = 100): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash;
    }

    // Subtle offsets derived from the seed for consistency and minimal variation
    const offsetX = (Math.abs(hash) % 20) - 10; // Range: -10 to 10
    const offsetY = (Math.abs(hash >> 8) % 8) - 4; // Range: -4 to 4

    const controlX = width / 2 + offsetX;
    const controlY = height / 2 + offsetY;

    return `M 0 ${height / 2} Q ${controlX} ${controlY} ${width} ${height / 2}`;
}

export { getRandomTheme, generateProfessionalUnderline };