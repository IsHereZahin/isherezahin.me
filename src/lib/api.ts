// src/lib/api.ts (Updated)
import { getDeviceId } from "@/utils";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

const getBlogs = async (page = 1, limit = 10) => {
    const response = await fetch(`/api/blog?page=${page}&limit=${limit}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to fetch blogs";
        throw new ApiError(message, response.status);
    }

    return await response.json();
};

const getBlog = {
    async getBlog(slug: string) {
        const response = await fetch(`/api/blog/${slug}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error || "Failed to fetch blog";
            throw new ApiError(message, response.status);
        }

        return await response.json();
    },
};

const blogViews = {
    async incrementView(slug: string) {
        const response = await fetch(`/api/blog/${slug}/view`, {
            method: 'POST',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error || "Failed to increment view";
            throw new ApiError(message, response.status);
        }

        return await response.json();
    },
};

const blogLikes = {
    async getLikes(slug: string) {
        const deviceId = getDeviceId();
        const response = await fetch(`/api/blog/${slug}/like`, {
            headers: {
                'x-device-id': deviceId,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error || "Failed to fetch likes";
            throw new ApiError(message, response.status);
        }

        return await response.json();
    },

    async addLike(slug: string) {
        const deviceId = getDeviceId();
        const response = await fetch(`/api/blog/${slug}/like`, {
            method: 'POST',
            headers: {
                'x-device-id': deviceId,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error || "Failed to add like";
            throw new ApiError(message, response.status);
        }

        return await response.json();
    },
};

export {
    getBlogs,
    getBlog,
    blogViews,
    blogLikes,
};