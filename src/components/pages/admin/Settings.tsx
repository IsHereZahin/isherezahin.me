"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import {
    Loader2,
    Mail,
    Settings as SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminSettings {
    newsletterEnabled: boolean;
}

export default function Settings() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<AdminSettings>({
        newsletterEnabled: true,
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
                </div>
            )}
        </section>
    );
}
