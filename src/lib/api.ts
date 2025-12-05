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

const getProjects = async (page = 1, limit = 10) => {
    const response = await fetch(`/api/project?page=${page}&limit=${limit}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to fetch projects";
        throw new ApiError(message, response.status);
    }

    return await response.json();
};

const getProject = {
    async getProject(slug: string) {
        const response = await fetch(`/api/project/${slug}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error || "Failed to fetch project";
            throw new ApiError(message, response.status);
        }

        return await response.json();
    },
};

const projectViews = {
    async incrementView(slug: string) {
        const response = await fetch(`/api/project/${slug}/view`, {
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

const projectLikes = {
    async getLikes(slug: string) {
        const deviceId = getDeviceId();
        const response = await fetch(`/api/project/${slug}/like`, {
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
        const response = await fetch(`/api/project/${slug}/like`, {
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

const createBlog = async (data: {
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    imageSrc: string;
    content: string;
    published: boolean;
}) => {
    const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to create blog";
        throw new ApiError(message, response.status);
    }

    return await response.json();
};

const createProject = async (data: {
    title: string;
    slug: string;
    excerpt: string;
    categories?: string;
    company: string;
    duration: string;
    status?: string;
    tags: string[];
    imageSrc: string;
    liveUrl?: string;
    githubUrl?: string;
    content: string;
    published: boolean;
}) => {
    const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to create project";
        throw new ApiError(message, response.status);
    }

    return await response.json();
};

const updateBlog = async (slug: string, data: {
    title: string;
    excerpt: string;
    tags: string[];
    imageSrc: string;
    content: string;
    published: boolean;
}) => {
    const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData.error || "Failed to update blog", response.status);
    }

    return await response.json();
};

const deleteBlog = async (slug: string) => {
    const response = await fetch(`/api/blog/${slug}`, { method: 'DELETE' });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData.error || "Failed to delete blog", response.status);
    }

    return await response.json();
};

const updateProject = async (slug: string, data: {
    title: string;
    excerpt: string;
    categories?: string;
    company: string;
    duration: string;
    status?: string;
    tags: string[];
    imageSrc: string;
    liveUrl?: string;
    githubUrl?: string;
    content: string;
    published: boolean;
}) => {
    const response = await fetch(`/api/project/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData.error || "Failed to update project", response.status);
    }

    return await response.json();
};

const deleteProject = async (slug: string) => {
    const response = await fetch(`/api/project/${slug}`, { method: 'DELETE' });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(errorData.error || "Failed to delete project", response.status);
    }

    return await response.json();
};

export {
    blogLikes, blogViews, createBlog, createProject, deleteBlog, deleteProject,
    getBlog, getBlogs, getProject, getProjects, projectLikes, projectViews,
    updateBlog, updateProject
};
