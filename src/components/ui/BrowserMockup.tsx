"use client"

import { Lock } from "lucide-react"
import type React from "react"
import ReferralLink from "./ReferralLink"

interface BrowserMockupProps {
    children: React.ReactNode
    url?: string | null
    className?: string
    showAddressBar?: boolean
    urlNotFoundReason?: string
}

export function BrowserMockup({
    children,
    url,
    className,
    showAddressBar = true,
    urlNotFoundReason = "URL not found or not provided",
}: Readonly<BrowserMockupProps>) {
    const isUrlMissing = !url || url.trim() === ""
    const displayUrl = isUrlMissing ? "http://********.***" : url

    const handleUrlClick = (e: React.MouseEvent) => {
        if (isUrlMissing) {
            e.preventDefault()
            alert(urlNotFoundReason)
        }
    }

    return (
        <div
            className={`w-full overflow-hidden rounded-lg bg-background shadow-lg ${className ?? ""}`}
        >
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 bg-background px-4 py-3">
                {/* Traffic Light Buttons */}
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                {/* Address Bar */}
                {showAddressBar && (
                    <div className="ml-4 flex flex-1 items-center gap-2 rounded-md bg-background px-3 py-1.5 border border-border">
                        <Lock className="h-4 w-4 text-secondary-foreground" />
                        {isUrlMissing ? (
                            <button
                                type="button"
                                onClick={handleUrlClick}
                                className="flex-1 truncate text-sm text-secondary-foreground hover:text-foreground transition-colors text-left cursor-pointer"
                            >
                                {displayUrl}
                            </button>
                        ) : (
                            <ReferralLink
                                href={url}
                                className="flex-1 truncate text-sm text-secondary-foreground hover:text-foreground transition-colors"
                            >
                                {displayUrl}
                            </ReferralLink>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="bg-background">{children}</div>
        </div>
    )
}
