"use client";

import ContributionsCalendar from "@/components/admin/dashboard/ContributionsCalendar";
import {
    buildSteps,
    buildWeight,
    buildWorkout,
    reposToHabits,
} from "@/components/admin/dashboard/githubToCards";
import { useGitHub } from "@/components/admin/dashboard/useGitHub";
import MyHabits from "@/components/be-run/MyHabits";
import StepsForToday from "@/components/be-run/StepsForToday";
import WeightLossPlan from "@/components/be-run/WeightLossPlan";
import WorkoutResults from "@/components/be-run/WorkoutResults";
import { ExternalLink, Github, RefreshCw } from "lucide-react";

function DashboardSkeleton() {
    return (
        <div className="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex flex-col gap-4">
                <div className="h-[336px] rounded-[26px] bg-[#e5e1d8]" />
                <div className="h-[168px] rounded-[24px] bg-[#efeae2]" />
                <div className="h-[150px] rounded-[24px] bg-[#efeae2]" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="h-[430px] rounded-[26px] bg-[#2f2f35]" />
                <div className="h-[360px] rounded-[24px] bg-[#efeae2]" />
            </div>
        </div>
    );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[26px] border border-[#EEEAE2] bg-white px-6 py-16 text-center">
            <p className="text-[15px] font-semibold text-[#26262B]">Couldn&apos;t load GitHub data</p>
            <p className="mt-1 max-w-md text-[13px] text-[#9a978f]">
                The GitHub API request failed. Check your connection or the GITHUB_ACCESS_TOKEN, then try again.
            </p>
            <button
                onClick={onRetry}
                className="mt-5 flex items-center gap-2 rounded-full bg-[#26262B] px-5 py-2.5 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
            >
                <RefreshCw className="h-4 w-4" />
                Retry
            </button>
        </div>
    );
}

export default function Dashboard() {
    const { data, isLoading, isError, refetch } = useGitHub();

    if (isLoading) return <DashboardSkeleton />;
    if (isError || !data) return <DashboardError onRetry={() => refetch()} />;

    const workoutProps = { ...buildWorkout(data), icon: Github };
    const stepsProps = {
        ...buildSteps(data),
        action: { label: "View Profile", icon: ExternalLink, href: data.profile.html_url },
    };
    const weightProps = buildWeight(data);
    const habitData = reposToHabits(data.topRepos);

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            {/* Left column */}
            <div className="flex flex-col gap-4">
                <WorkoutResults {...workoutProps} />
                <StepsForToday {...stepsProps} />
                <WeightLossPlan {...weightProps} />
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
