// src/lib/api.ts
export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
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
        const response = await fetch(`/api/blog/${slug}`)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            const message = errorData.error || "Failed to fetch blog"
            throw new ApiError(message, response.status)
        }

        return await response.json()
    },
}

export { getBlogs, getBlog }
