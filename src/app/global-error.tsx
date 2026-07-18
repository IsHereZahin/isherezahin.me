"use client";

import { useEffect } from "react";

// Root error boundary. It replaces the entire document when even the root layout
// fails, so it must render its own <html>/<body> and cannot rely on app CSS —
// styles are inlined so it renders in any state.
export default function GlobalError({
    error,
    reset,
}: {
    readonly error: Error & { digest?: string };
    readonly reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "24px",
                        textAlign: "center",
                        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                        background: "#0f0f11",
                        color: "#f2f0ea",
                    }}
                >
                    <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>Something went wrong</h1>
                    <p style={{ fontSize: "14px", color: "#9a978f", maxWidth: "440px", margin: 0, lineHeight: 1.6 }}>
                        A critical error occurred and the page couldn&apos;t be displayed. Please try again.
                    </p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <button
                            onClick={reset}
                            style={{
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "9999px",
                                padding: "10px 20px",
                                fontSize: "13px",
                                fontWeight: 600,
                                background: "#f2f0ea",
                                color: "#0f0f11",
                            }}
                        >
                            Try again
                        </button>
                        <a
                            href="/"
                            style={{
                                textDecoration: "none",
                                borderRadius: "9999px",
                                padding: "10px 20px",
                                fontSize: "13px",
                                fontWeight: 600,
                                border: "1px solid rgba(255,255,255,0.18)",
                                color: "#f2f0ea",
                            }}
                        >
                            Go home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
