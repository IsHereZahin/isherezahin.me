import crypto from "crypto";

// Hash IP for privacy - we don't store raw IPs
export function hashIP(ip: string | null): string {
    if (!ip) return "unknown";
    // Use SHA256 with a salt for privacy
    const salt = process.env.IP_HASH_SALT || "visitor-tracking-salt";
    return crypto.createHash("sha256").update(ip + salt).digest("hex").substring(0, 16);
}

// Get country from IP using free IP geolocation
// Uses ip-api.com (free, no API key needed, 45 requests/minute limit)
export async function getCountryFromIP(ip: string | null): Promise<string> {
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
        return "Local";
    }

    try {
        // Use ip-api.com free tier (no API key needed)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
            signal: AbortSignal.timeout(2000), // 2 second timeout
        });

        if (!response.ok) return "Unknown";

        const data = await response.json();
        if (data.status === "success" && data.countryCode) {
            return data.countryCode;
        }
        return "Unknown";
    } catch {
        // Fail silently - don't block tracking if geo lookup fails
        return "Unknown";
    }
}

// Parse device type from user agent
export function parseDeviceType(userAgent: string | null): string {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    
    // Check for bots first
    if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider") || ua.includes("googlebot")) {
        return "Bot";
    }
    
    // Mobile devices
    if (ua.includes("iphone") || ua.includes("ipod")) return "iOS";
    if (ua.includes("ipad")) return "iPad";
    if (ua.includes("android")) {
        if (ua.includes("mobile")) return "Android";
        return "Android Tablet";
    }
    
    // Desktop OS
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("macintosh") || ua.includes("mac os")) return "macOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("chromeos")) return "ChromeOS";
    
    return "Other";
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
    return new Date().toISOString().split("T")[0];
}
