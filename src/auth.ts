// src/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// GitHub profile type
interface GitHubProfile {
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
}

// Extend the built-in session and JWT types
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            avatar_url?: string | null;
            username?: string | null;
        };
    }

    interface JWT {
        accessToken?: string;
        username?: string;
        avatar_url?: string;
        name?: string | null;
        email?: string | null;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: "read:user user:email public_repo",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // On initial sign in
            if (account && profile) {
                const githubProfile = profile as unknown as GitHubProfile;
                
                token.accessToken = account.access_token;
                token.username = githubProfile.login;
                token.name = githubProfile.name;
                token.email = githubProfile.email;
                token.avatar_url = githubProfile.avatar_url;
            }
            return token;
        },

        async session({ session, token }) {
            // Expose GitHub data to the client
            if (token.accessToken && typeof token.accessToken === 'string') {
                session.accessToken = token.accessToken;
            }
            
            if (token.username && typeof token.username === 'string') {
                session.user.username = token.username;
            }
            
            if (token.avatar_url && typeof token.avatar_url === 'string') {
                session.user.avatar_url = token.avatar_url;
            }
            
            // Assign name and email - handle null explicitly
            session.user = {
                ...session.user,
                name: token.name ?? session.user.name ?? null,
                email: token.email ?? session.user.email ?? null,
            };
            
            return session;
        },
    },
});