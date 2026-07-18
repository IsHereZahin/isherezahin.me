"use client";

import { useQuery } from "@tanstack/react-query";

export interface GitHubProfile {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    html_url: string;
    followers: number;
    following: number;
    public_repos: number;
    location: string | null;
    company: string | null;
    blog: string | null;
}

export interface GitHubRepoSummary {
    name: string;
    description: string | null;
    html_url: string;
    stars: number;
    forks: number;
    language: string | null;
}

export interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

export interface GitHubData {
    profile: GitHubProfile;
    stars: number;
    forks: number;
    topRepos: GitHubRepoSummary[];
    languages: { name: string; pct: number }[];
    contributions: { total: number; days: ContributionDay[] };
}

export function useGitHub() {
    return useQuery<GitHubData>({
        queryKey: ["github-dashboard"],
        queryFn: async () => {
            const res = await fetch("/api/github");
            if (!res.ok) throw new Error("Failed to load GitHub data");
            return res.json();
        },
        staleTime: 1000 * 60 * 30,
        retry: 1,
    });
}
