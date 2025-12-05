"use client";

import { MotionWrapper } from "@/components/motion";
import {
    BlurImage,
    Button,
    PageTitle,
    ReferralLink,
    Section,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { Edit, Eye, EyeOff, Globe, LogIn, LogOut, Monitor, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    isCurrent?: boolean;
}

export default function ProfileDashboard() {
    const { user, logout, login } = useAuth();
    const [activeSection, setActiveSection] = useState("personal");

    const personalInfo = {
        firstName: user?.name?.split(' ')[0] || 'Leia',
        lastName: user?.name?.split(' ')[1] || 'Cooper',
        email: user?.email || 'leia.cooper@gmail.com',
        phone: '+880 1234-5678-90',
        gender: 'Unknown',
    };

    const sessions: Session[] = [
        { id: "1", device: "Windows", browser: "Chrome v141.0.0.0", location: "Chittagong, Bangladesh", lastActive: "Oct 29, 2025, 1:36 PM", isCurrent: true },
        { id: "2", device: "MacBook", browser: "Safari v17.0", location: "Dhaka, Bangladesh", lastActive: "Oct 30, 2025, 9:12 AM" },
        { id: "3", device: "iPhone", browser: "Mobile Safari", location: "Sylhet, Bangladesh", lastActive: "Oct 30, 2025, 10:45 AM" },
    ];

    const [showOnDeveloperPage, setShowOnDeveloperPage] = useState(true);
    const [showContactInfo, setShowContactInfo] = useState(true);
    const [showBioInfo, setShowBioInfo] = useState(true);

    const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(prev => !prev);
    };

    if (!user) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <MotionWrapper delay={0.2}>
                    <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
                </MotionWrapper>
                <MotionWrapper delay={0.4}>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                        You need to log in to view your profile.
                    </p>
                </MotionWrapper>
                <MotionWrapper delay={0.6}>
                    <Button
                        text="Login to Access Profile"
                        onClick={login}
                        icon={<LogIn className="h-4 w-4" />}
                    />
                </MotionWrapper>
            </div>
        );
    }

    return (
        <Section id="profile">
            <PageTitle title="Your Profile" subtitle={`Hello, ${user.name}!`} />

            <MotionWrapper delay={0.2} className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-65 space-y-1 bg-card border border-border rounded-xl p-4">
                    <nav className="space-y-2">
                        <Link
                            href="#personal"
                            onClick={() => setActiveSection("personal")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeSection === "personal"
                                ? "bg-foreground text-secondary"
                                : "text-foreground hover:bg-muted"
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Personal Information
                        </Link>
                        <Link
                            href="#Sessions"
                            onClick={() => setActiveSection("Sessions")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeSection === "Sessions"
                                ? "bg-foreground text-secondary"
                                : "text-foreground hover:bg-muted"
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Sessions
                        </Link>
                        <Link
                            href="#visibilitySettings"
                            onClick={() => setActiveSection("visibilitySettings")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeSection === "visibilitySettings"
                                ? "bg-foreground text-secondary"
                                : "text-foreground hover:bg-muted"
                                }`}
                        >
                            <Edit className="h-4 w-4" />
                            Visibility Settings
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors text-foreground cursor-pointer hover:bg-muted"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {activeSection === "personal" && (
                        <section className="border border-border rounded-xl p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0 mx-auto lg:mx-0">
                                    <BlurImage
                                        src={user.image || "/default-avatar.png"}
                                        alt={user.name || "User Avatar"}
                                        width={100}
                                        height={100}
                                        className="rounded-full border-2 border-primary"
                                    />
                                </div>
                                {/* Personal Info */}
                                <div className="flex-1 min-w-0 space-y-4">
                                    {/* Grid for basic info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs sm:text-sm font-medium text-foreground block">First Name</label>
                                            <p className="text-sm sm:text-base text-foreground truncate">{personalInfo.firstName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs sm:text-sm font-medium text-foreground block">Last Name</label>
                                            <p className="text-sm sm:text-base text-foreground truncate">{personalInfo.lastName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs sm:text-sm font-medium text-foreground block">Email</label>
                                            <p className="text-sm sm:text-base text-foreground truncate">{personalInfo.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs sm:text-sm font-medium text-foreground block">Phone</label>
                                            <p className="text-sm sm:text-base text-foreground truncate">{personalInfo.phone}</p>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-1">
                                        <label className="text-xs sm:text-sm font-medium text-foreground block">Gender</label>
                                        <p className="text-sm sm:text-base text-foreground">{personalInfo.gender}</p>
                                    </div>

                                    {/* Action Button */}
                                    <ReferralLink
                                        href={`https://github.com/${user.username}`}
                                        className="inline-block text-sm font-medium text-primary hover:underline"
                                    >
                                        Edit Profile
                                    </ReferralLink>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "Sessions" && (
                        <section className="border border-border rounded-xl p-6">
                            <h3 className="text-base font-semibold mb-4">Active Sessions ({sessions.length})</h3>
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={`border rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 transition-colors ${session.isCurrent ? "border-primary bg-primary/5" : "border-border"
                                        }`}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        <Monitor className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm truncate">{session.device}</p>
                                                {session.isCurrent && (
                                                    <span className="px-2 py-1 text-xs bg-foreground text-secondary rounded-full font-medium">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground mt-0.5 truncate">
                                                <span>{session.browser}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                                                <Globe className="h-3 w-3 opacity-70" />
                                                <span>{session.location}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 truncate">{session.lastActive}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={`text-xs rounded-md px-3 py-1 transition self-start sm:self-auto ${session.isCurrent
                                            ? "border-gray-300 text-muted-foreground bg-transparent cursor-not-allowed"
                                            : "border border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
                                            }`}
                                        disabled={session.isCurrent}
                                    >
                                        {session.isCurrent ? "Current" : "Revoke"}
                                    </button>
                                </div>
                            ))}
                        </section>
                    )}

                    {activeSection === "visibilitySettings" && (
                        <section className="border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Visibility Settings</h3>
                            <div className="space-y-4">
                                {/* Show Profile on Developer Page */}
                                <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-medium text-foreground">Show Profile on Developer Page</h4>
                                            <p className="text-xs text-muted-foreground">Display your profile information on the developer directory.</p>
                                        </div>
                                        <button
                                            onClick={() => toggleVisibility(setShowOnDeveloperPage)}
                                            className={`p-2 rounded-full transition-colors cursor-pointer ${showOnDeveloperPage
                                                ? "bg-secondary text-foreground hover:bg-secondary/90"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                            title={showOnDeveloperPage ? "Turn off" : "Turn on"}
                                        >
                                            {showOnDeveloperPage ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Show Contact Info */}
                                <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-medium text-foreground">Show Contact Info</h4>
                                            <p className="text-xs text-muted-foreground">Make your email and contact details visible to others.</p>
                                        </div>
                                        <button
                                            onClick={() => toggleVisibility(setShowContactInfo)}
                                            className={`p-2 rounded-full transition-colors cursor-pointer ${showContactInfo
                                                ? "bg-secondary text-foreground hover:bg-secondary/90"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                            title={showContactInfo ? "Turn off" : "Turn on"}
                                        >
                                            {showContactInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Show Bio Info */}
                                <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-medium text-foreground">Show Bio Info</h4>
                                            <p className="text-xs text-muted-foreground">Include your bio and personal details in your profile.</p>
                                        </div>
                                        <button
                                            onClick={() => toggleVisibility(setShowBioInfo)}
                                            className={`p-2 rounded-full transition-colors cursor-pointer ${showBioInfo
                                                ? "bg-secondary text-foreground hover:bg-secondary/90"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                            title={showBioInfo ? "Turn off" : "Turn on"}
                                        >
                                            {showBioInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                text="Save Changes"
                                onClick={() => {
                                    console.log("Save visibility settings");
                                }}
                                className="mt-4 w-full md:w-auto"
                            />
                        </section>
                    )}
                </div>
            </MotionWrapper>
        </Section>
    );
}