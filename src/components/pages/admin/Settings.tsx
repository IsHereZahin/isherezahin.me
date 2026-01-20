"use client";

import { adminSettings, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, MessageCirclePlus, MessageSquare, Megaphone, Settings as SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminSettingsData {
    newsletterEnabled: boolean;
    allowGitHubLogin: boolean;
    allowGoogleLogin: boolean;
    primaryLoginMethod: "github" | "google";
    allowAnyUserStartConversation: boolean;
    sayloPagePublic: boolean;
}

export default function Settings() {
    const { isAdmin } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin-settings"],
        queryFn: adminSettings.get,
        enabled: isAdmin,
    });

    const mutation = useMutation({
        mutationFn: ({ key, value }: { key: string; value: boolean | string }) => adminSettings.update(key, value),
        onSuccess: (result, variables) => {
            queryClient.setQueryData<{ settings: AdminSettingsData }>(["admin-settings"], (old) => {
                if (!old) return old;
                return { settings: { ...old.settings, [variables.key]: variables.value } };
            });
            toast.success(result.message);
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update setting");
        },
    });

    if (error instanceof ApiError && error.status === 403) {
        router.push("/");
        return null;
    }

    if (!isAdmin) return null;

    const settings = data?.settings || {
        newsletterEnabled: true,
        allowGitHubLogin: true,
        allowGoogleLogin: false,
        primaryLoginMethod: "github" as const,
        allowAnyUserStartConversation: true,
        sayloPagePublic: true,
    };

    const handleToggleSetting = (key: keyof AdminSettingsData) => {
        const newValue = !settings[key];
        if ((key === "allowGitHubLogin" && !newValue && !settings.allowGoogleLogin) ||
            (key === "allowGoogleLogin" && !newValue && !settings.allowGitHubLogin)) {
            toast.error("At least one login method must be enabled");
            return;
        }
        mutation.mutate({ key, value: newValue });

        if (key === "allowGitHubLogin" && !newValue && settings.primaryLoginMethod === "github") {
            mutation.mutate({ key: "primaryLoginMethod", value: "google" });
        } else if (key === "allowGoogleLogin" && !newValue && settings.primaryLoginMethod === "google") {
            mutation.mutate({ key: "primaryLoginMethod", value: "github" });
        }
    };

    const handleUpdatePrimaryMethod = (value: "github" | "google") => {
        mutation.mutate({ key: "primaryLoginMethod", value });
    };

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <SettingsIcon className="h-5 w-5 icon-bw" />
                <h3 className="text-base font-semibold">Admin Settings</h3>
            </div>

            {isLoading ? (
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
                                    <p className="text-xs text-muted-foreground">Send email notifications to active subscribers when a new blog is published</p>
                                </div>
                            </div>
                            <ToggleButton isOn={settings.newsletterEnabled} isLoading={mutation.isPending && mutation.variables?.key === "newsletterEnabled"} onClick={() => handleToggleSetting("newsletterEnabled")} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.newsletterEnabled ? (
                                    <span className="text-green-600 dark:text-green-400">✓ Subscribers will receive email notifications for new blog posts</span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">⚠ Newsletter notifications are disabled. New blog posts will not trigger emails.</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Login Methods Setting */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full shrink-0 bg-muted"><MessageSquare className="h-5 w-5 icon-bw" /></div>
                            <div className="min-w-0">
                                <p className="font-medium text-sm">Login Methods</p>
                                <p className="text-xs text-muted-foreground">Select which login methods are available</p>
                            </div>
                        </div>
                        <div className="space-y-3 ml-12">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <SmallToggle isOn={settings.allowGitHubLogin} isLoading={mutation.isPending && mutation.variables?.key === "allowGitHubLogin"} onClick={() => handleToggleSetting("allowGitHubLogin")} />
                                <span className="text-sm">GitHub</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <SmallToggle isOn={settings.allowGoogleLogin} isLoading={mutation.isPending && mutation.variables?.key === "allowGoogleLogin"} onClick={() => handleToggleSetting("allowGoogleLogin")} />
                                <span className="text-sm">Google</span>
                            </label>
                            {settings.allowGitHubLogin && settings.allowGoogleLogin && (
                                <div className="pt-3 border-t border-border mt-3">
                                    <p className="text-xs text-muted-foreground mb-2">Primary login method</p>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => handleUpdatePrimaryMethod("github")} disabled={mutation.isPending} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${settings.primaryLoginMethod === "github" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"} disabled:opacity-50`}>GitHub</button>
                                        <button type="button" onClick={() => handleUpdatePrimaryMethod("google")} disabled={mutation.isPending} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${settings.primaryLoginMethod === "google" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"} disabled:opacity-50`}>Google</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.allowGitHubLogin && settings.allowGoogleLogin ? (
                                    <span className="text-green-600 dark:text-green-400">✓ Login modal will show both options</span>
                                ) : (
                                    <span className="text-muted-foreground">Direct {settings.allowGitHubLogin ? "GitHub" : "Google"} login (no modal)</span>
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
                                    <p className="text-xs text-muted-foreground">Control who can start new discussions on blogs and projects</p>
                                </div>
                            </div>
                            <ToggleButton isOn={settings.allowAnyUserStartConversation} isLoading={mutation.isPending && mutation.variables?.key === "allowAnyUserStartConversation"} onClick={() => handleToggleSetting("allowAnyUserStartConversation")} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.allowAnyUserStartConversation ? (
                                    <span className="text-green-600 dark:text-green-400">✓ Any GitHub user can start conversations on blogs and projects</span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">⚠ Only admins can start conversations. Other users can still comment on existing ones.</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Saylo Page Visibility Setting */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full shrink-0 ${settings.sayloPagePublic ? "bg-muted" : "bg-muted/50"}`}>
                                    <Megaphone className={`h-5 w-5 icon-bw ${!settings.sayloPagePublic ? "opacity-50" : ""}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm">Saylo Page Public</p>
                                    <p className="text-xs text-muted-foreground">Make Saylo page publicly accessible to all visitors</p>
                                </div>
                            </div>
                            <ToggleButton isOn={settings.sayloPagePublic} isLoading={mutation.isPending && mutation.variables?.key === "sayloPagePublic"} onClick={() => handleToggleSetting("sayloPagePublic")} />
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                {settings.sayloPagePublic ? (
                                    <span className="text-green-600 dark:text-green-400">✓ Saylo page is visible to all visitors</span>
                                ) : (
                                    <span className="text-amber-600 dark:text-amber-400">⚠ Saylo page shows "Coming Soon" to visitors. Only admins can access it.</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function ToggleButton({ isOn, isLoading, onClick }: { isOn: boolean; isLoading: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} disabled={isLoading} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 self-start sm:self-center ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
            {isLoading ? <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-white" /></span> : <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${isOn ? "translate-x-6" : "translate-x-1"}`} />}
        </button>
    );
}

function SmallToggle({ isOn, isLoading, onClick }: { isOn: boolean; isLoading: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} disabled={isLoading} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin text-white mx-auto" /> : <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${isOn ? "translate-x-5" : "translate-x-1"}`} />}
        </button>
    );
}
