"use client";

import { BlurImage } from "@/components/ui";
import { Button } from "@/components/ui/shadcn-button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Check, Loader2, Pencil, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePersonal() {
    const { user } = useAuth();
    const [bio, setBio] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [originalBio, setOriginalBio] = useState("");

    useEffect(() => {
        if (user?.bio) {
            setBio(user.bio);
            setOriginalBio(user.bio);
        }
    }, [user?.bio]);

    if (!user) return null;

    const personalInfo = {
        firstName: user?.name?.split(" ")[0] || "User",
        lastName: user?.name?.split(" ")[1] || "",
        email: user?.email || "No email",
        provider: user?.provider || "unknown",
    };

    const handleSave = async () => {
        if (bio.length > 500) {
            toast.error("Bio must be 500 characters or less");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio }),
            });

            if (response.ok) {
                setOriginalBio(bio);
                setIsEditing(false);
                toast.success("Profile updated successfully");
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };


    const handleCancel = () => {
        setBio(originalBio);
        setIsEditing(false);
    };

    return (
        <section className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 icon-bw" />
                <h3 className="text-base font-semibold">Personal Information</h3>
            </div>
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
                <div className="flex-1 min-w-0 space-y-4 w-full">
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
                                {personalInfo.lastName || "-"}
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
                                Provider
                            </label>
                            <p className="text-sm sm:text-base text-foreground truncate capitalize">
                                {personalInfo.provider}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs sm:text-sm font-medium text-foreground block">
                                Bio
                            </label>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Edit
                                </button>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="space-y-2">
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    rows={3}
                                    maxLength={500}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {bio.length}/500 characters
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <Check className="h-3 w-3" />
                                            )}
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm sm:text-base text-foreground">
                                {bio || "No bio yet. Click edit to add one."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
