"use client";

import { BlurImage, ReferralLink } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ProfilePersonal() {
    const { user } = useAuth();

    if (!user) return null;

    const personalInfo = {
        firstName: user?.name?.split(" ")[0] || "User",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "No email",
        phone: "+880 1234-5678-90",
        gender: "Unknown",
    };

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <BlurImage
                        src={user.image || "/default-avatar.png"}
                        alt={user.name || "User Avatar"}
                        width={100}
                        height={100}
                        className="rounded-full border-2 border-primary"
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-foreground block">
                                First Name
                            </label>
                            <p className="text-sm sm:text-base text-foreground truncate">
                                {personalInfo.firstName}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-foreground block">
                                Last Name
                            </label>
                            <p className="text-sm sm:text-base text-foreground truncate">
                                {personalInfo.lastName || "—"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-foreground block">
                                Email
                            </label>
                            <p className="text-sm sm:text-base text-foreground truncate">
                                {personalInfo.email}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs sm:text-sm font-medium text-foreground block">
                                Phone
                            </label>
                            <p className="text-sm sm:text-base text-foreground truncate">
                                {personalInfo.phone}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs sm:text-sm font-medium text-foreground block">
                            Gender
                        </label>
                        <p className="text-sm sm:text-base text-foreground">
                            {personalInfo.gender}
                        </p>
                    </div>

                    <ReferralLink
                        href={`https://github.com/${user.username}`}
                        className="inline-block text-sm font-medium text-primary hover:underline"
                    >
                        Edit Profile
                    </ReferralLink>
                </div>
            </div>
        </section>
    );
}
