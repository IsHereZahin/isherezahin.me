import { NextResponse } from "next/server";

// GitHub login (case-insensitive on GitHub's side).
const LOGIN = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER || "IsHereZahin";
const TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const ghHeaders: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "isherezahin-admin-dashboard",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

interface GitHubRepo {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    fork: boolean;
    pushed_at: string;
}

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

async function getProfile() {
    const res = await fetch(`https://api.github.com/users/${LOGIN}`, {
        headers: ghHeaders,
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`profile ${res.status}`);
    const d = await res.json();
    return {
        login: d.login,
        name: d.name,
        avatar_url: d.avatar_url,
        bio: d.bio,
        html_url: d.html_url,
        followers: d.followers,
        following: d.following,
        public_repos: d.public_repos,
        location: d.location,
        company: d.company,
        blog: d.blog,
    };
}

async function getRepos() {
    const res = await fetch(
        `https://api.github.com/users/${LOGIN}/repos?per_page=100&sort=pushed`,
        { headers: ghHeaders, next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`repos ${res.status}`);
    const repos: GitHubRepo[] = await res.json();

    const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const forks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);

    const topRepos = [...repos]
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map((r) => ({
            name: r.name,
            description: r.description,
            html_url: r.html_url,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language,
        }));

    const langCount = new Map<string, number>();
    for (const r of repos) {
        if (r.language) langCount.set(r.language, (langCount.get(r.language) || 0) + 1);
    }
    const totalLang = [...langCount.values()].reduce((a, b) => a + b, 0) || 1;
    const languages = [...langCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, pct: Math.round((count / totalLang) * 100) }));

    return { stars, forks, topRepos, languages };
}

async function getContributions() {
    // No `?y` param → all years the account has contributed, so the dashboard can
    // navigate to any month/year.
    const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${LOGIN}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`contributions ${res.status}`);
    const d = await res.json();
    const days: ContributionDay[] = (d.contributions || []).map(
        (c: { date: string; count: number; level: number }) => ({
            date: c.date,
            count: c.count,
            level: c.level,
        })
    );
    // "This year" total for the gauge = current calendar year.
    const year = new Date().getFullYear();
    const totals: Record<string, number> = d.total || {};
    const total =
        totals[String(year)] ??
        days.filter((c) => c.date.startsWith(`${year}-`)).reduce((s, c) => s + c.count, 0);
    return { total, days };
}

export async function GET() {
    try {
        const [profile, repos, contributions] = await Promise.all([
            getProfile(),
            getRepos().catch(() => ({ stars: 0, forks: 0, topRepos: [], languages: [] })),
            getContributions().catch(() => ({ total: 0, days: [] as ContributionDay[] })),
        ]);

        return NextResponse.json(
            { profile, ...repos, contributions },
            { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
        );
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Failed to load GitHub data" },
            { status: 502 }
        );
    }
}
