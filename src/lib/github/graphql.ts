// src/lib/github/graphql.ts
import { GITHUB_ACCESS_TOKEN } from "@/lib/constants";

// GitHub GraphQL API
const GITHUB_API_URL = "https://api.github.com/graphql";

if (!GITHUB_ACCESS_TOKEN) {
    throw new Error("Missing GitHub access token");
}

// GraphQL API helper
export async function callGraphQL<T>( query: string, variables: Record<string, unknown>, token: string ): Promise<T> {
    const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
        console.error("GraphQL error:", result.errors || result);
        throw new Error(
            result.errors ? JSON.stringify(result.errors) : response.statusText
        );
    }

    return result.data;
}