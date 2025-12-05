// src/lib/auth-utils.ts
import { auth } from '@/auth';
import { MY_MAIL } from '@/lib/constants';

export async function checkIsAdmin(): Promise<boolean> {
    const session = await auth();
    return session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();
}
