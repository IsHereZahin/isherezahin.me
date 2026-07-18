"use client";

import { adminSettings, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Github, Loader2, LogIn, Mail, Megaphone, MessageCirclePlus } from "lucide-react";
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

    const saving = (key: string) => mutation.isPending && mutation.variables?.key === key;

    if (isLoading) return <SettingsSkeleton />;

    return (
        <div className="space-y-5">
            {/* Authentication */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <SectionHeading icon={LogIn} title="Authentication" description="Choose how people can sign in" />

                <div className="mt-5 space-y-2.5">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#EEEAE2] px-4 py-3">
                        <span className="flex items-center gap-2.5 text-[14px] font-medium text-[#26262B]">
                            <Github className="h-[18px] w-[18px]" /> GitHub
                        </span>
                        <SmallToggle isOn={settings.allowGitHubLogin} isLoading={saving("allowGitHubLogin")} onClick={() => handleToggleSetting("allowGitHubLogin")} />
                    </label>
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#EEEAE2] px-4 py-3">
                        <span className="flex items-center gap-2.5 text-[14px] font-medium text-[#26262B]">
                            <GoogleMark /> Google
                        </span>
                        <SmallToggle isOn={settings.allowGoogleLogin} isLoading={saving("allowGoogleLogin")} onClick={() => handleToggleSetting("allowGoogleLogin")} />
                    </label>
                </div>

                {settings.allowGitHubLogin && settings.allowGoogleLogin && (
                    <div className="mt-4">
                        <p className="mb-2 text-[12px] font-medium text-[#57544e]">Primary login method</p>
                        <div className="flex gap-2">
                            {(["github", "google"] as const).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleUpdatePrimaryMethod(m)}
                                    disabled={mutation.isPending}
                                    className={`h-9 rounded-full px-4 text-[12px] font-medium capitalize transition-colors disabled:opacity-50 ${settings.primaryLoginMethod === m ? "bg-[#26262B] text-white" : "border border-[#EEEAE2] bg-white text-[#57544e] hover:bg-[#F6F4EF]"}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <StatusNote ok={settings.allowGitHubLogin && settings.allowGoogleLogin}>
                    {settings.allowGitHubLogin && settings.allowGoogleLogin
                        ? "Login modal will show both options"
                        : `Direct ${settings.allowGitHubLogin ? "GitHub" : "Google"} login (no modal)`}
                </StatusNote>
            </section>

            {/* Notifications & Access */}
            <section className="rounded-[24px] border border-[#EEEAE2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <SectionHeading icon={Megaphone} title="Notifications & Access" description="Emails, conversations, and public pages" />

                <div className="mt-4 divide-y divide-[#f1ede5]">
                    <ToggleRow
                        icon={Mail}
                        title="Newsletter Notifications"
                        description="Email active subscribers when a new blog is published"
                        isOn={settings.newsletterEnabled}
                        isLoading={saving("newsletterEnabled")}
                        onToggle={() => handleToggleSetting("newsletterEnabled")}
                        note={settings.newsletterEnabled
                            ? { ok: true, text: "Subscribers receive email notifications for new blog posts" }
                            : { ok: false, text: "Disabled — new blog posts will not trigger emails" }}
                    />
                    <ToggleRow
                        icon={MessageCirclePlus}
                        title="Allow Any User to Start Conversations"
                        description="Control who can start new discussions on blogs and projects"
                        isOn={settings.allowAnyUserStartConversation}
                        isLoading={saving("allowAnyUserStartConversation")}
                        onToggle={() => handleToggleSetting("allowAnyUserStartConversation")}
                        note={settings.allowAnyUserStartConversation
                            ? { ok: true, text: "Any GitHub user can start conversations" }
                            : { ok: false, text: "Only admins can start conversations; others can still comment" }}
                    />
                    <ToggleRow
                        icon={Megaphone}
                        title="Saylo Page Public"
                        description="Make the Saylo page accessible to all visitors"
                        isOn={settings.sayloPagePublic}
                        isLoading={saving("sayloPagePublic")}
                        onToggle={() => handleToggleSetting("sayloPagePublic")}
                        note={settings.sayloPagePublic
                            ? { ok: true, text: "Saylo page is visible to all visitors" }
                            : { ok: false, text: `Shows "Coming Soon" to visitors; only admins can access it` }}
                    />
                </div>
            </section>
        </div>
    );
}

function SectionHeading({ icon: Icon, title, description }: { icon: typeof Mail; title: string; description: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F6F4EF]">
                <Icon className="h-5 w-5 text-[#26262B]" />
            </div>
            <div>
                <h3 className="text-[16px] font-semibold text-[#26262B]">{title}</h3>
                <p className="text-[12px] text-[#9a978f]">{description}</p>
            </div>
        </div>
    );
}

function ToggleRow({ icon: Icon, title, description, isOn, isLoading, onToggle, note }: {
    icon: typeof Mail;
    title: string;
    description: string;
    isOn: boolean;
    isLoading: boolean;
    onToggle: () => void;
    note: { ok: boolean; text: string };
}) {
    return (
        <div className="py-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isOn ? "bg-[#F6F4EF]" : "bg-[#F6F4EF]/60"}`}>
                        <Icon className={`h-[18px] w-[18px] text-[#57544e] ${isOn ? "" : "opacity-60"}`} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[14px] font-medium text-[#26262B]">{title}</p>
                        <p className="text-[12px] text-[#9a978f]">{description}</p>
                    </div>
                </div>
                <ToggleButton isOn={isOn} isLoading={isLoading} onClick={onToggle} />
            </div>
            <div className={`mt-2.5 flex items-start gap-1.5 rounded-xl px-3 py-2 text-[12px] ${note.ok ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
                <span className="mt-px">{note.ok ? "✓" : "⚠"}</span>
                <span>{note.text}</span>
            </div>
        </div>
    );
}

function StatusNote({ ok, children }: { ok: boolean; children: React.ReactNode }) {
    return (
        <div className={`mt-4 flex items-start gap-1.5 rounded-xl px-3 py-2 text-[12px] ${ok ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-[#F6F4EF] text-[#57544e]"}`}>
            <span className="mt-px">{ok ? "✓" : "•"}</span>
            <span>{children}</span>
        </div>
    );
}

function ToggleButton({ isOn, isLoading, onClick }: { isOn: boolean; isLoading: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} disabled={isLoading} aria-pressed={isOn} className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#26262B]/30 focus:ring-offset-2 ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
            {isLoading ? <span className="absolute inset-0 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-white" /></span> : <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${isOn ? "translate-x-6" : "translate-x-1"}`} />}
        </button>
    );
}

function SmallToggle({ isOn, isLoading, onClick }: { isOn: boolean; isLoading: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} disabled={isLoading} aria-pressed={isOn} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} disabled:opacity-50`}>
            {isLoading ? <Loader2 className="mx-auto h-3 w-3 animate-spin text-white" /> : <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${isOn ? "translate-x-5" : "translate-x-1"}`} />}
        </button>
    );
}

function GoogleMark() {
    return (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
    );
}

function SettingsSkeleton() {
    return (
        <div className="space-y-5">
            <div className="h-8 w-40 animate-pulse rounded bg-[#EFEBE3]" />
            {[0, 1].map((i) => (
                <div key={i} className="rounded-[24px] border border-[#EEEAE2] bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#EFEBE3]" />
                        <div className="space-y-2"><div className="h-4 w-40 animate-pulse rounded bg-[#EFEBE3]" /><div className="h-3 w-56 animate-pulse rounded bg-[#EFEBE3]" /></div>
                    </div>
                    <div className="mt-5 space-y-3">{[0, 1, 2].map((j) => <div key={j} className="h-14 animate-pulse rounded-2xl bg-[#F6F4EF]" />)}</div>
                </div>
            ))}
        </div>
    );
}
