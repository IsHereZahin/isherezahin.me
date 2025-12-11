"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import {
    Loader2,
    Mail,
    MessageCirclePlus,
    MessageSquare,
    Settings as SettingsIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminSettings {
    newsletterEnabled: boolean;
    allowGitHubLogin: boolean;
    allowGoogleLogin: boolean;
    primaryLoginMethod: "github" | "google";
    allowAnyUserStartConversation: boolean;
}

export default function Settings() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<AdminSettings>({
        newsletterEnabled: true,
        allowGitHubLogin: true,
        allowGoogleLogin: false,
        primaryLoginMethod: "github",
        allowAnyUserStartConversation: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/admin/settings");
            const data = await response.json();

            if (response.ok) {
                setSettings(data.settings);
            } else if (response.status === 403) {
                router.push("/");
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!isAdmin) {
            router.push("/");
            return;
        }
        fetchSettings();
    }, [isAdmin, fetchSettings, router]);

    const handleToggleSetting = async (key: keyof AdminSettings) => {
        setSaving(key);
        const newValue = !settings[key];

        // Prevent disabling both login methods
        if ((key === "allowGitHubLogin" && !newValue && !settings.allowGoogleLogin) ||
            (key === "allowGoogleLogin" && !newValue && !settings.allowGitHubLogin)) {
            toast.error("At least one login method must be enabled");
            setSaving(null);
            return;
        }

        try {
            const response = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value: newValue }),
            });

            const data = await response.json();

            if (response.ok) {
                setSettings((prev) => ({ ...prev, [key]: newValue }));
                toast.success(data.message);

                // Auto-update primary method if the current primary is being disabled
                if (key === "allowGitHubLogin" && !newValue && settings.primaryLoginMethod === "github") {
                    handleUpdatePrimaryMethod("google");
                } else if (key === "allowGoogleLogin" && !newValue && settings.primaryLoginMethod === "google") {
                    handleUpdatePrimaryMethod("github");
                }
            } else {
                toast.error(data.error || "Failed to update setting");
            }
        } catch (error) {
            console.error("Error updating setting:", error);
            toast.error("Failed to update setting");
        } finally {
            setSaving(null);
        }
    };

    const handleUpdatePrimaryMethod = async (value: "github" | "google") => {
        setSaving("primaryLoginMethod");
        try {
            const response = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "primaryLoginMethod", value }),
            });

            const data = await response.json();

            if (response.ok) {
                setSettings((prev) => ({ ...prev, primaryLoginMethod: value }));
                toast.success(data.message);
            } else {
                toast.error(data.error || "Failed to update setting");
            }
        } catch (error) {
            console.error("Error updating setting:", error);
            toast.error("Failed to update setting");
        } finally {
            setSaving(null);
        }
    };

    if (!isAdmin) return null;

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <SettingsIcon className="h-5 w-5 icon-bw" />
                <h3 className="text-base font-semibold">Admin Settings</h3>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Newsletter Setting */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full shrink-0 ${settings.newsletterEnabled ? "bg-muted" : "bg-muted/50"}`}>
                                    <Mail className={`h-5 w-5 icon-bw ${!settings.newsletterEnabled ? "opacity-50" : ""}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm">Newsletter Notifications</p>
                                    <p className="text-xs text-muted-foreground">
                                        Send email notifications to active subscribers when a new blog is published
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggleSetting("newsletterEnabled")}
                                disabled={saving === "newsletterEnabled"}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 self-start sm:self-center ${settings.newsletterEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    } disabled:opacity-50`}
                            >
                                {saving === "newsletterEnabled" ? (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    </span>
                                ) : (
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${settings.newsletterEnabled ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                )}
                            </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.newsletterEnabled ? (
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓ Subscribers will receive email notifications for new blog posts
                                    </span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">
                                        ⚠ Newsletter notifications are disabled. New blog posts will not trigger emails.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Login Methods Setting */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full shrink-0 bg-muted">
                                <MessageSquare className="h-5 w-5 icon-bw" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-sm">Login Methods</p>
                                <p className="text-xs text-muted-foreground">
                                    Select which login methods are available
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 ml-12">
                            {/* GitHub Login */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => handleToggleSetting("allowGitHubLogin")}
                                    disabled={saving === "allowGitHubLogin"}
                                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${settings.allowGitHubLogin ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}
                                >
                                    {saving === "allowGitHubLogin" ? (
                                        <Loader2 className="h-3 w-3 animate-spin text-white mx-auto" />
                                    ) : (
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${settings.allowGitHubLogin ? "translate-x-5" : "translate-x-1"}`} />
                                    )}
                                </button>
                                <span className="text-sm">GitHub</span>
                            </label>

                            {/* Google Login */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => handleToggleSetting("allowGoogleLogin")}
                                    disabled={saving === "allowGoogleLogin"}
                                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${settings.allowGoogleLogin ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}
                                >
                                    {saving === "allowGoogleLogin" ? (
                                        <Loader2 className="h-3 w-3 animate-spin text-white mx-auto" />
                                    ) : (
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${settings.allowGoogleLogin ? "translate-x-5" : "translate-x-1"}`} />
                                    )}
                                </button>
                                <span className="text-sm">Google</span>
                            </label>

                            {/* Primary Method Selector - only show when both are enabled */}
                            {settings.allowGitHubLogin && settings.allowGoogleLogin && (
                                <div className="pt-3 border-t border-border mt-3">
                                    <p className="text-xs text-muted-foreground mb-2">Primary login method</p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdatePrimaryMethod("github")}
                                            disabled={saving === "primaryLoginMethod"}
                                            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${settings.primaryLoginMethod === "github" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"} disabled:opacity-50`}
                                        >
                                            GitHub
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdatePrimaryMethod("google")}
                                            disabled={saving === "primaryLoginMethod"}
                                            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${settings.primaryLoginMethod === "google" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"} disabled:opacity-50`}
                                        >
                                            Google
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.allowGitHubLogin && settings.allowGoogleLogin ? (
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓ Login modal will show both options
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">
                                        Direct {settings.allowGitHubLogin ? "GitHub" : "Google"} login (no modal)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Start Conversation Permission Setting */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full shrink-0 ${settings.allowAnyUserStartConversation ? "bg-muted" : "bg-muted/50"}`}>
                                    <MessageCirclePlus className={`h-5 w-5 icon-bw ${!settings.allowAnyUserStartConversation ? "opacity-50" : ""}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm">Allow Any User to Start Conversations</p>
                                    <p className="text-xs text-muted-foreground">
                                        Control who can start new discussions on blogs and projects
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggleSetting("allowAnyUserStartConversation")}
                                disabled={saving === "allowAnyUserStartConversation"}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 self-start sm:self-center ${settings.allowAnyUserStartConversation ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    } disabled:opacity-50`}
                            >
                                {saving === "allowAnyUserStartConversation" ? (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    </span>
                                ) : (
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${settings.allowAnyUserStartConversation ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                )}
                            </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.allowAnyUserStartConversation ? (
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓ Any GitHub user can start conversations on blogs and projects
                                    </span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">
                                        ⚠ Only admins can start conversations. Other users can still comment on existing ones.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
