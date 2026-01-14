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

// Saylo API
export type SortOption = "recent" | "popular" | "oldest";

const saylo = {
    async getAll(page = 1, limit = 10, category: string | null = null, sort: SortOption = "recent") {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), sort });
        if (category && category !== "all") {
            params.set("category", category);
        }
        const response = await fetch(`/api/saylo?${params}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch saylos", response.status);
        }
        return await response.json();
    },

    async get(id: string) {
        const response = await fetch(`/api/saylo/${id}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch saylo", response.status);
        }
        return await response.json();
    },

    async create(data: { content: string; category?: string | null; newCategory?: string | null; images?: string[]; videos?: string[]; published?: boolean }) {
        const response = await fetch("/api/saylo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create saylo", response.status);
        }
        return await response.json();
    },

    async update(id: string, data: { content?: string; category?: string | null; published?: boolean }) {
        const response = await fetch(`/api/saylo/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update saylo", response.status);
        }
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`/api/saylo/${id}`, { method: "DELETE" });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete saylo", response.status);
        }
        return await response.json();
    },

    async like(id: string) {
        const deviceId = getDeviceId();
        const response = await fetch(`/api/saylo/${id}/like`, {
            method: "POST",
            headers: { "x-device-id": deviceId },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to toggle like", response.status);
        }
        return await response.json();
    },

    async getLikes(id: string) {
        const deviceId = getDeviceId();
        const response = await fetch(`/api/saylo/${id}/like`, {
            headers: { "x-device-id": deviceId },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch likes", response.status);
        }
        return await response.json();
    },

    async getCategories() {
        const response = await fetch("/api/saylo/categories");
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch categories", response.status);
        }
        return await response.json();
    },

    async createCategory(name: string, color?: string | null) {
        const response = await fetch("/api/saylo/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, color }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create category", response.status);
        }
        return await response.json();
    },

    async deleteCategory(id: string) {
        const response = await fetch(`/api/saylo/categories?id=${id}`, { method: "DELETE" });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete category", response.status);
        }
        return await response.json();
    },
};

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

// About Hero API
const aboutHero = {
    async get() {
        const response = await fetch('/api/admin/about');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch about hero", response.status);
        }
        return await response.json();
    },

    async update(data: {
        name: string;
        title: string;
        location: string;
        age?: string;
        imageSrc: string;
        paragraphs: string[];
        pageTitle?: string;
        pageSubtitle?: string;
    }) {
        const response = await fetch('/api/admin/about', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update about hero", response.status);
        }
        return await response.json();
    },
};

// Statistics API
const statistics = {
    async get() {
        const response = await fetch("/api/statistics");
        if (response.status === 403) throw new ApiError("Statistics are currently private", 403);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load statistics", response.status);
        }
        return await response.json();
    },

    async getSettings() {
        const response = await fetch("/api/admin/statistics-settings");
        if (response.status === 403) throw new ApiError("Access denied", 403);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load settings", response.status);
        }
        return await response.json();
    },

    async updateVisibility(body: Record<string, unknown>) {
        const response = await fetch("/api/statistics/visibility", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update visibility", response.status);
        }
        return await response.json();
    },
};

// Profile API
const profile = {
    async update(data: { bio: string }) {
        const response = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update profile", response.status);
        }
        return await response.json();
    },
};

// Sessions API
const sessions = {
    async getAll() {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load sessions", response.status);
        }
        return await response.json();
    },

    async revoke(sessionId: string) {
        const response = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to revoke session", response.status);
        }
        return await response.json();
    },
};

// Admin Settings API
const adminSettings = {
    async get() {
        const response = await fetch("/api/admin/settings");
        if (response.status === 403) throw new ApiError("Access denied", 403);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load settings", response.status);
        }
        return await response.json();
    },

    async update(key: string, value: boolean | string) {
        const response = await fetch("/api/admin/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update setting", response.status);
        }
        return await response.json();
    },

    async getPublic() {
        const response = await fetch("/api/admin/settings/public");
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load public settings", response.status);
        }
        return await response.json();
    },
};

// Admin Users API
const adminUsers = {
    async getAll(search: string, filter: string, page: number) {
        const params = new URLSearchParams({ search, filter, page: page.toString() });
        const response = await fetch(`/api/users?${params}`);
        if (response.status === 403) throw new ApiError("Access denied", 403);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load users", response.status);
        }
        return await response.json();
    },

    async toggleBan(userId: string, action: "ban" | "unban") {
        const response = await fetch(`/api/users/${userId}/ban`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update user", response.status);
        }
        return await response.json();
    },
};

// Admin Subscribers API
const adminSubscribers = {
    async getAll(search: string, filter: string, page: number) {
        const params = new URLSearchParams({ search, filter, page: page.toString() });
        const response = await fetch(`/api/admin/subscribers?${params}`);
        if (response.status === 403) throw new ApiError("Access denied", 403);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to load subscribers", response.status);
        }
        return await response.json();
    },

    async toggleStatus(subscriberId: string, action: "activate" | "deactivate") {
        const response = await fetch(`/api/admin/subscribers/${subscriberId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update subscriber", response.status);
        }
        return await response.json();
    },

    async delete(subscriberId: string) {
        const response = await fetch(`/api/admin/subscribers/${subscriberId}`, { method: "DELETE" });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete subscriber", response.status);
        }
        return await response.json();
    },
};

// Contact Message API
const contactMessage = {
    async send(data: { name: string; email: string; message: string }) {
        const response = await fetch("/api/contact/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to send message", response.status);
        }
        return await response.json();
    },
};

// Cloudinary API
const cloudinary = {
    async upload(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/cloudinary", { method: "POST", body: formData });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to upload image", response.status);
        }
        return await response.json();
    },

    async delete(url: string) {
        const response = await fetch(`/api/cloudinary?url=${encodeURIComponent(url)}`, { method: "DELETE" });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete image", response.status);
        }
        return await response.json();
    },
};

// Quests API
const quests = {
    async getAll() {
        const response = await fetch('/api/quests');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch quests", response.status);
        }
        return await response.json();
    },

    async get(id: string) {
        const response = await fetch(`/api/quests/${id}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch quest", response.status);
        }
        return await response.json();
    },

    async create(data: {
        date: string;
        title: string;
        location: string;
        description: string;
        media: { type: "image" | "video"; src: string; thumbnail?: string }[];
        order?: number;
        isActive?: boolean;
    }) {
        const response = await fetch('/api/quests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create quest", response.status);
        }
        return await response.json();
    },

    async update(id: string, data: {
        date: string;
        title: string;
        location: string;
        description: string;
        media: { type: "image" | "video"; src: string; thumbnail?: string }[];
        order?: number;
        isActive?: boolean;
    }) {
        const response = await fetch(`/api/quests/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update quest", response.status);
        }
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`/api/quests/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete quest", response.status);
        }
        return await response.json();
    },
};

// Bucket List API
const bucketList = {
    async getAll() {
        const response = await fetch('/api/bucket-list');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch bucket list", response.status);
        }
        return await response.json();
    },

    async get(id: string) {
        const response = await fetch(`/api/bucket-list/${id}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to fetch bucket list item", response.status);
        }
        return await response.json();
    },

    async create(data: {
        title: string;
        description: string;
        category: string;
        status?: string;
        location?: string;
        completedDate?: string;
        order?: number;
        isActive?: boolean;
    }) {
        const response = await fetch('/api/bucket-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to create bucket list item", response.status);
        }
        return await response.json();
    },

    async update(id: string, data: {
        title: string;
        description: string;
        category: string;
        status?: string;
        location?: string;
        completedDate?: string;
        order?: number;
        isActive?: boolean;
    }) {
        const response = await fetch(`/api/bucket-list/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to update bucket list item", response.status);
        }
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`/api/bucket-list/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.error || "Failed to delete bucket list item", response.status);
        }
        return await response.json();
    },
};

export {
    aboutHero, adminSettings, adminSubscribers, adminUsers, blogLikes, blogViews, bucketList, cloudinary, contactInfo, contactMessage,
    createBlog, createProject, currentStatus, deleteBlog, deleteProject, getBlog, getBlogs, getBlogTags, getProject,
    getProjects, getProjectTags, newsletter, profile, projectLikes, projectViews, quests, saylo, sessions, statistics, testimonials,
    updateBlog, updateProject, workExperience
};

