import { clsx, type ClassValue } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";
import { UAParser } from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper function to extract client IP address from request headers
export function getClientIp(request: NextRequest): string | null {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }

    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    if (cfConnectingIp) {
        return cfConnectingIp.trim();
    }

    return null;
}

export interface SessionInfo {
    deviceType: string;
    ipAddress: string | null;
}

export function parseSessionInfo(userAgent: string | null, ipAddress?: string | null): SessionInfo {
    const parser = new UAParser(userAgent || "");
    const result = parser.getResult();

    let deviceType = "Unknown";
    const deviceTypeRaw = result.device.type;
    if (deviceTypeRaw === "mobile") {
        deviceType = result.os.name || "Mobile";
    } else if (deviceTypeRaw === "tablet") {
        deviceType = "Tablet";
    } else if (result.os.name) {
        deviceType = result.os.name;
    }

    return { deviceType, ipAddress: ipAddress || null };
}
