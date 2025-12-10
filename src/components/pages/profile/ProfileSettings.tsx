"use client";

import { newsletter } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { AlertCircle, Bell, BellOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileSettings() {
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isNewsletterEnabled, setIsNewsletterEnabled] = useState(true);
    const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
    const [isTogglingSubscription, setIsTogglingSubscription] = useState(false);

    useEffect(() => {
        const checkSubscription = async () => {
            if (user?.email) {
                setIsLoadingSubscription(true);
                try {
                    const data = await newsletter.checkSubscription(user.email);
                    setIsSubscribed(data.isSubscribed);
                    setIsNewsletterEnabled(data.newsletterEnabled ?? true);
                } catch (error) {
                    console.error("Error checking subscription:", error);
                } finally {
                    setIsLoadingSubscription(false);
                }
            } else {
                setIsLoadingSubscription(false);
            }
        };
        checkSubscription();
    }, [user?.email]);

    const handleToggleSubscription = async () => {
        if (!user?.email) {
            toast.error("Email not found");
            return;
        }

        setIsTogglingSubscription(true);
        try {
            if (isSubscribed) {
                const data = await newsletter.unsubscribe(user.email);
                if (data.success) {
                    setIsSubscribed(false);
                    toast.success("Successfully unsubscribed from newsletter");
                }
            } else {
                const data = await newsletter.subscribe(user.email);
                if (data.success || data.alreadySubscribed) {
                    setIsSubscribed(true);
                    toast.success(
                        data.alreadySubscribed
                            ? "You're already subscribed!"
                            : "Successfully subscribed to newsletter! 🎉"
                    );
                }
            }
        } catch (error) {
            console.error("Error toggling subscription:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsTogglingSubscription(false);
        }
    };

    if (!user) return null;

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 icon-bw" />
                <h3 className="text-lg font-semibold">Settings</h3>
            </div>
            <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border/50 bg-card/50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-foreground">
                                    Subscribe to Newsletter
                                </h4>
                                {isSubscribed && (
                                    <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-500 rounded-full font-medium">
                                        Active
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isSubscribed
                                    ? "You're receiving email notifications for new blog posts."
                                    : "Get the latest updates and news directly in your inbox."}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleSubscription}
                            disabled={isLoadingSubscription || isTogglingSubscription}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${isSubscribed
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                                }`}
                            title={isSubscribed ? "Unsubscribe" : "Subscribe"}
                        >
                            {isLoadingSubscription || isTogglingSubscription ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isSubscribed ? (
                                <Bell className="h-4 w-4" />
                            ) : (
                                <BellOff className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {isSubscribed && (
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                            <p className="text-xs text-muted-foreground">
                                Subscribed email: <span className="text-foreground">{user.email}</span>
                            </p>
                            {!isNewsletterEnabled && (
                                <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                        Admin has currently disabled newsletter notifications. You will receive emails once the admin enables it.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
