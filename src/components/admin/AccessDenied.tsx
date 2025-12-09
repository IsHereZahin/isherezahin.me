"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import { Button, Heading } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { LogIn, LogOut, User } from "lucide-react";

export default function AccessDenied() {
    const { user, status, login, logout } = useAuth();

    console.log(user, status);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <MotionWrapper delay={0.2}>
                <Heading text="Access Restricted" size="md" />
            </MotionWrapper>

            {/* Message */}
            <MotionWrapper delay={0.4}>
                {user ? (
                    <>
                        <h2 className="text-base font-semibold text-secondary-foreground mb-2">
                            Hi <span className="text-primary">{user.name || user.username}</span>, you’re not an admin.
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Please log in with your admin account to access this section.
                        </p>
                    </>
                ) : (
                    <h2 className="text-base font-semibold text-secondary-foreground mb-6">
                        This page is only available for admin users.
                    </h2>
                )}
            </MotionWrapper>

            {/* Buttons */}
            <MotionWrapper delay={0.6} className="flex gap-3">
                {user ? (
                    <>
                        <Button
                            text="View Profile"
                            href="/profile"
                            icon={<User className="h-4 w-4" />}
                        />
                        <Button
                            text="Logout"
                            onClick={logout}
                            icon={<LogOut className="h-4 w-4" />}
                        />
                    </>
                ) : (
                    <Button
                        text="Login with Admin Account"
                        onClick={login}
                        icon={<LogIn className="h-4 w-4" />}
                    />
                )}
            </MotionWrapper>

        </div>
    );
}
