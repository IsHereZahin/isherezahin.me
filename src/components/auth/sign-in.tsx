"use client";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Header() {
    const { user, status, login, logout } = useAuth();

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div>
            {user ? (
                <>
                    <p>Hello, {user.name}</p>
                    <button onClick={logout}>Sign out</button>
                </>
            ) : (
                <button onClick={login}>Sign in with GitHub</button>
            )}
        </div>
    );
}