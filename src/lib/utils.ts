import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UAParser } from "ua-parser-js";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface SessionInfo {
    deviceType: string;
}

export function parseSessionInfo(userAgent: string | null): SessionInfo {
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

    return { deviceType };
}
