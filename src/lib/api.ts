// src/lib/api.ts (Updated)
import { getDeviceId } from "@/utils";

export class ApiError extends Error {
    status: number;
    data?: Record<string, unknown>;

    constructor(message: string, status: number, data?: Record<string, unknown>) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

const getBlogs = async (page = 1, limit = 10, tags: string[] = [], search = "") => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (tags.length > 0) {
        params.set('tags', tags.join(','));
    }
    if (search.trim()) {
        params.set('search', search.trim());
    }
    const response = await fetch(`/api/blog?${params.toString()}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to fetch blogs";
        throw new ApiError(message, response.status);
    }

    return await response.json();
};

const getBlogTags = async () => {
    const response = await fetch('/api/blog/tags');

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to fetch blog tags";
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

const getProjects = async (page = 1, limit = 10, tags: string[] = [], search = "") => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (tags.length > 0) {
        params.set('tags', tags.join(','));
    }
    if (search.trim()) {
        params.set('search', search.trim());
    }
    const response = await fetch(`/api/project?${params.toString()}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to fetch projects";
        throw new ApiError(message, response.status);
    }

    return await response.json();
};

const getProjectTags = async () => {
    const response = await fetch('/api/project/tags');

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Failed to fetch project tags";
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

// Newsletter subscription
const newsletter = {
    async checkSubscription(email: string) {
        const response = await fetch(`/api/subscribe?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to check subscription", response.status);
        }

        return await response.json();
    },

    async subscribe(email: string) {
        const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to subscribe", response.status);
        }

        return await response.json();
    },

    async unsubscribe(email: string) {
        const response = await fetch("/api/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to unsubscribe", response.status);
        }

        return await response.json();
    },

    async sendOtp(email: string) {
        const response = await fetch("/api/subscribe/otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.error || "Failed to send verification code",
                response.status,
                data
            );
        }

        return data;
    },

    async verifyOtp(email: string, otp: string) {
        const response = await fetch("/api/subscribe/otp", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.error || "Failed to verify code",
                response.status,
                data
            );
        }

        return data;
    },
};

// Testimonials API
const testimonials = {
    async getAll(includeInactive = false) {
        const url = includeInactive ? '/api/admin/testimonials?all=true' : '/api/admin/testimonials';
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch testimonials", response.status);
        }
        return await response.json();
    },

    async create(data: { quote: string; name: string; role: string; order?: number; isActive?: boolean }) {
        const response = await fetch('/api/admin/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create testimonial", response.status);
        }
        return await response.json();
    },

    async update(id: string, data: { quote: string; name: string; role: string; order?: number; isActive?: boolean }) {
        const response = await fetch(`/api/admin/testimonials/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update testimonial", response.status);
        }
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete testimonial", response.status);
        }
        return await response.json();
    },
};

// Current Status API
const currentStatus = {
    async getAll(includeInactive = false) {
        const url = includeInactive ? '/api/admin/current-status?all=true' : '/api/admin/current-status';
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch current status", response.status);
        }
        return await response.json();
    },

    async create(data: { text: string; order?: number; isActive?: boolean }) {
        const response = await fetch('/api/admin/current-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create current status", response.status);
        }
        return await response.json();
    },

    async update(id: string, data: { text: string; order?: number; isActive?: boolean }) {
        const response = await fetch(`/api/admin/current-status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update current status", response.status);
        }
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`/api/admin/current-status/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete current status", response.status);
        }
        return await response.json();
    },
};

// Contact Info API
const contactInfo = {
    async get() {
        const response = await fetch('/api/admin/contact-info');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch contact info", response.status);
        }
        return await response.json();
    },

    async update(data: { email?: string; headline: string; subheadline: string; highlightText?: string; skills: string[] }) {
        const response = await fetch('/api/admin/contact-info', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update contact info", response.status);
        }
        return await response.json();
    },
};

// Hero API
const hero = {
    async get() {
        const response = await fetch('/api/admin/hero');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch hero data", response.status);
        }
        return await response.json();
    },

    async update(data: {
        profileImage?: string;
        greeting: string;
        name: string;
        tagline: string;
        description: string;
        highlightedSkills?: string[];
        buttons?: { text: string; href: string; icon?: string; variant?: string }[];
        isActive?: boolean;
    }) {
        const response = await fetch('/api/admin/hero', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update hero data", response.status);
        }
        return await response.json();
    },
};

// Work Experience API
const workExperience = {
    async getAll(includeInactive = false) {
        const url = includeInactive ? '/api/admin/work-experience?all=true' : '/api/admin/work-experience';
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch work experience", response.status);
        }
        return await response.json();
    },

    async create(data: {
        start: string; end?: string; title: string; company: string; companyUrl: string;
        location: string; type?: string; description: string; highlights: { text: string }[];
        logo: string; order?: number; isActive?: boolean;
    }) {
        const response = await fetch('/api/admin/work-experience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create work experience", response.status);
        }
        return await response.json();
    },

    async update(id: string, data: {
        start: string; end?: string; title: string; company: string; companyUrl: string;
        location: string; type?: string; description: string; highlights: { text: string }[];
        logo: string; order?: number; isActive?: boolean;
    }) {
        const response = await fetch(`/api/admin/work-experience/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update work experience", response.status);
        }
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`/api/admin/work-experience/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete work experience", response.status);
        }
        return await response.json();
    },
};

export {
    blogLikes, blogViews, contactInfo, createBlog, createProject, currentStatus, deleteBlog, deleteProject,
    getBlog, getBlogs, getBlogTags, getProject, getProjects, getProjectTags, hero,
    newsletter, projectLikes, projectViews, testimonials, updateBlog, updateProject, workExperience
};

