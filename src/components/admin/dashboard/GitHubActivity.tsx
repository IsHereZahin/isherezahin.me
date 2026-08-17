"use client";

import ActivityCard from "@/components/admin/dashboard/ActivityCard";
import CommunityCard from "@/components/admin/dashboard/CommunityCard";
import ContributionsCalendar from "@/components/admin/dashboard/ContributionsCalendar";
import { buildWorkout, reposToHabits } from "@/components/admin/dashboard/githubToCards";
import { useGitHub } from "@/components/admin/dashboard/useGitHub";
import MyHabits from "@/components/be-run/MyHabits";
import WorkoutResults from "@/components/be-run/WorkoutResults";
import { Github, RefreshCw } from "lucide-react";
import { SkeletonCard } from "./primitives";

function GitHubSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col gap-4">
                <SkeletonCard className="h-[336px]" />
                <SkeletonCard className="h-[210px]" />
                <SkeletonCard className="h-[240px]" />
            </div>
            <div className="flex flex-col gap-4">
                <SkeletonCard className="h-[430px]" />
                <SkeletonCard className="h-[360px]" />
            </div>
        </div>
    );
}

function GitHubError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[26px] border border-[var(--s-border)] bg-[var(--s-card)] px-6 py-16 text-center">
            <p className="text-[15px] font-semibold text-[var(--s-text)]">Couldn&apos;t load GitHub data</p>
            <p className="mt-1 max-w-md text-[13px] text-[var(--s-muted)]">
                The GitHub API request failed. Check your connection or the GITHUB_ACCESS_TOKEN, then try again.
            </p>
            <button
                onClick={onRetry}
                className="mt-5 flex items-center gap-2 rounded-full bg-[var(--s-invert)] px-5 py-2.5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
            >
                <RefreshCw className="h-4 w-4" />
                Retry
            </button>
        </div>
    );
}

export default function GitHubActivity() {
    const { data, isPending, isError, refetch } = useGitHub();

    // `isPending`, not `isLoading`: the latter is `isPending && isFetching`, so it
    // is false during the server render (nothing fetches there) and the panel
    // would fall through to the error state instead of showing this skeleton.
    if (isPending) return <GitHubSkeleton />;
    if (isError || !data) return <GitHubError onRetry={() => refetch()} />;

    const workoutProps = { ...buildWorkout(data), icon: Github };
    const habitData = reposToHabits(data.topRepos);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            {/* Left column */}
            <div className="flex flex-col gap-4">
                <WorkoutResults {...workoutProps} />
                <ActivityCard data={data} />
                <CommunityCard data={data} />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
                <ContributionsCalendar days={data.contributions.days} />
                <MyHabits
                    habits={habitData}
                    metricLabel="Stars"
                    title="Top Repositories"
                    showTotal={false}
                    emptyLabel="No public repositories found."
                />
            </div>
        </div>
    );
}
