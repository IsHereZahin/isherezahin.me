// src/lib/firebase/chat.ts
"use client";

import {
    DataSnapshot,
    endBefore,
    get,
    limitToLast,
    onDisconnect,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    serverTimestamp,
    set,
    update
} from "firebase/database";
import { getFirebaseDatabase } from "./config";

// Types
export interface FirebaseMessage {
    id?: string;
    conversationId: string;
    senderId: string;
    senderType: "user" | "admin";
    senderName: string;
    senderImage?: string;
    content: string;
    isRead: boolean;
    readAt?: number | null;
    isEdited: boolean;
    editHistory?: { content: string; editedAt: number }[];
    isDeleted: boolean;
    createdAt: number | object;
    updatedAt?: number | object;
}

export interface FirebaseConversation {
    id?: string;
    participantId: string;
    participantName: string;
    participantEmail: string;
    participantImage?: string;
    lastMessage?: string;
    lastMessageAt?: number | object;
    lastMessageBy?: "user" | "admin";
    unreadCountUser: number;
    unreadCountAdmin: number;
    isActive: boolean;
    createdAt: number | object;
    updatedAt?: number | object;
}

export interface FirebasePresence {
    isOnline: boolean;
    lastSeen: number | object;
    hideLastSeen?: boolean;
}

export interface FirebaseTyping {
    isTyping: boolean;
    timestamp: number;
}

// Helper to convert Firebase snapshot to array with IDs
function snapshotToArray<T>(snapshot: DataSnapshot): (T & { id: string })[] {
    const result: (T & { id: string })[] = [];
    snapshot.forEach((child) => {
        result.push({ id: child.key!, ...child.val() });
    });
    return result;
}

// ============ CONVERSATIONS ============

export async function getConversations(isAdmin: boolean, userId: string) {
    const db = getFirebaseDatabase();
    const conversationsRef = ref(db, "conversations");
    const snapshot = await get(conversationsRef);

    if (!snapshot.exists()) return [];

    const conversations = snapshotToArray<FirebaseConversation>(snapshot);

    if (isAdmin) {
        // Admin gets all active conversations except their own
        return conversations
            .filter((c) => c.isActive && c.participantId !== userId)
            .sort((a, b) => {
                const aTime = typeof a.lastMessageAt === "number" ? a.lastMessageAt : 0;
                const bTime = typeof b.lastMessageAt === "number" ? b.lastMessageAt : 0;
                return bTime - aTime;
            });
    } else {
        // User gets their own conversation
        return conversations.find((c) => c.participantId === userId && c.isActive) || null;
    }
}

export async function getConversationById(conversationId: string) {
    const db = getFirebaseDatabase();
    const conversationRef = ref(db, `conversations/${conversationId}`);
    const snapshot = await get(conversationRef);

    if (!snapshot.exists()) return null;
    return { id: snapshot.key!, ...snapshot.val() } as FirebaseConversation & { id: string };
}

export async function createConversation(data: Omit<FirebaseConversation, "id">) {
    const db = getFirebaseDatabase();
    const conversationsRef = ref(db, "conversations");
    const newRef = push(conversationsRef);
    await set(newRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return newRef.key!;
}

export async function updateConversation(conversationId: string, data: Partial<FirebaseConversation>) {
    const db = getFirebaseDatabase();
    const conversationRef = ref(db, `conversations/${conversationId}`);
    await update(conversationRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function getUserConversation(userId: string): Promise<(FirebaseConversation & { id: string }) | null> {
    const db = getFirebaseDatabase();
    const conversationsRef = ref(db, "conversations");
    const snapshot = await get(conversationsRef);

    if (!snapshot.exists()) return null;

    let found: (FirebaseConversation & { id: string }) | null = null;
    snapshot.forEach((child) => {
        const conv = child.val() as FirebaseConversation;
        if (conv.participantId === userId) {
            found = { id: child.key!, ...conv };
        }
    });
    return found;
}

// ============ MESSAGES ============

export async function getMessages(conversationId: string, limit = 30, beforeTimestamp?: number) {
    const db = getFirebaseDatabase();
    const messagesRef = ref(db, `messages/${conversationId}`);

    let messagesQuery;
    if (beforeTimestamp) {
        messagesQuery = query(
            messagesRef,
            orderByChild("createdAt"),
            endBefore(beforeTimestamp),
            limitToLast(limit + 1)
        );
    } else {
        messagesQuery = query(messagesRef, orderByChild("createdAt"), limitToLast(limit + 1));
    }

    const snapshot = await get(messagesQuery);
    if (!snapshot.exists()) return { messages: [], hasMore: false };

    const messages = snapshotToArray<FirebaseMessage>(snapshot)
        .filter((m) => !m.isDeleted)
        .sort((a, b) => {
            const aTime = typeof a.createdAt === "number" ? a.createdAt : 0;
            const bTime = typeof b.createdAt === "number" ? b.createdAt : 0;
            return aTime - bTime;
        });

    const hasMore = messages.length > limit;
    if (hasMore) messages.shift(); // Remove oldest if we have more

    return { messages, hasMore };
}

export async function sendMessage(data: Omit<FirebaseMessage, "id" | "createdAt" | "updatedAt">) {
    const db = getFirebaseDatabase();
    const messagesRef = ref(db, `messages/${data.conversationId}`);
    const newRef = push(messagesRef);

    const message = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    await set(newRef, message);
    return newRef.key!;
}

export async function editMessage(
    conversationId: string,
    messageId: string,
    content: string,
    previousContent: string
) {
    const db = getFirebaseDatabase();
    const messageRef = ref(db, `messages/${conversationId}/${messageId}`);
    const snapshot = await get(messageRef);

    if (!snapshot.exists()) throw new Error("Message not found");

    const message = snapshot.val() as FirebaseMessage;
    const editHistory = message.editHistory || [];
    editHistory.push({ content: previousContent, editedAt: Date.now() });

    await update(messageRef, {
        content,
        isEdited: true,
        editHistory,
        updatedAt: serverTimestamp(),
    });
}

export async function getMessage(conversationId: string, messageId: string) {
    const db = getFirebaseDatabase();
    const messageRef = ref(db, `messages/${conversationId}/${messageId}`);
    const snapshot = await get(messageRef);

    if (!snapshot.exists()) return null;
    return { id: snapshot.key!, ...snapshot.val() } as FirebaseMessage & { id: string };
}

export async function markMessagesAsRead(conversationId: string, senderType: "user" | "admin") {
    const db = getFirebaseDatabase();
    const messagesRef = ref(db, `messages/${conversationId}`);
    const snapshot = await get(messagesRef);

    if (!snapshot.exists()) return;

    const updates: Record<string, unknown> = {};
    const now = Date.now();

    snapshot.forEach((child) => {
        const msg = child.val() as FirebaseMessage;
        if (msg.senderType === senderType && !msg.isRead) {
            updates[`${child.key}/isRead`] = true;
            updates[`${child.key}/readAt`] = now;
        }
    });

    if (Object.keys(updates).length > 0) {
        await update(messagesRef, updates);
    }
}

export async function deleteConversationMessages(conversationId: string) {
    const db = getFirebaseDatabase();
    const messagesRef = ref(db, `messages/${conversationId}`);
    const snapshot = await get(messagesRef);

    if (!snapshot.exists()) return;

    const updates: Record<string, boolean> = {};
    snapshot.forEach((child) => {
        updates[`${child.key}/isDeleted`] = true;
    });

    await update(messagesRef, updates);
}

export async function deleteConversationPermanently(conversationId: string) {
    const db = getFirebaseDatabase();
    
    // Delete all messages for this conversation
    const messagesRef = ref(db, `messages/${conversationId}`);
    await set(messagesRef, null);
    
    // Delete typing status for this conversation
    const typingRef = ref(db, `typing/${conversationId}`);
    await set(typingRef, null);
    
    // Delete the conversation itself
    const conversationRef = ref(db, `conversations/${conversationId}`);
    await set(conversationRef, null);
}

// ============ PRESENCE ============

export async function updatePresence(userId: string, isOnline: boolean) {
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, `presence/${userId}`);

    await update(presenceRef, {
        isOnline,
        lastSeen: serverTimestamp(),
    });
}

export async function getPresence(userId: string) {
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, `presence/${userId}`);
    const snapshot = await get(presenceRef);

    if (!snapshot.exists()) return null;
    return snapshot.val() as FirebasePresence;
}

export async function updatePresenceSettings(userId: string, hideLastSeen: boolean) {
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, `presence/${userId}`);
    await update(presenceRef, { hideLastSeen });
}

export async function getAllActiveUsers(excludeUserId?: string) {
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, "presence");
    const snapshot = await get(presenceRef);

    if (!snapshot.exists()) return [];

    const users: (FirebasePresence & { odId: string })[] = [];
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    snapshot.forEach((child) => {
        if (excludeUserId && child.key === excludeUserId) return;
        const presence = child.val() as FirebasePresence;
        const lastSeen = typeof presence.lastSeen === "number" ? presence.lastSeen : 0;
        if (presence.isOnline || lastSeen > fiveMinutesAgo) {
            users.push({ odId: child.key!, ...presence });
        }
    });

    return users;
}

// Setup presence with disconnect handling
export function setupPresenceWithDisconnect(userId: string) {
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, `presence/${userId}`);
    const connectedRef = ref(db, ".info/connected");

    const unsubscribe = onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
            // Set online status
            update(presenceRef, {
                isOnline: true,
                lastSeen: serverTimestamp(),
            });

            // Setup disconnect handler
            onDisconnect(presenceRef).update({
                isOnline: false,
                lastSeen: serverTimestamp(),
            });
        }
    });

    return () => {
        unsubscribe();
        update(presenceRef, {
            isOnline: false,
            lastSeen: serverTimestamp(),
        });
    };
}

// ============ TYPING ============

export async function setTypingStatus(conversationId: string, odId: string, isTyping: boolean) {
    const db = getFirebaseDatabase();
    const typingRef = ref(db, `typing/${conversationId}/${odId}`);

    if (isTyping) {
        await set(typingRef, {
            isTyping: true,
            timestamp: serverTimestamp(),
        });
        // Auto-clear after 5 seconds
        setTimeout(() => {
            update(typingRef, { isTyping: false });
        }, 5000);
    } else {
        await update(typingRef, { isTyping: false });
    }
}

export async function getTypingStatus(conversationId: string, excludeUserId: string) {
    const db = getFirebaseDatabase();
    const typingRef = ref(db, `typing/${conversationId}`);
    const snapshot = await get(typingRef);

    if (!snapshot.exists()) return false;

    let isTyping = false;
    const fiveSecondsAgo = Date.now() - 5000;

    snapshot.forEach((child) => {
        if (child.key === excludeUserId) return;
        const typing = child.val() as FirebaseTyping;
        const timestamp = typeof typing.timestamp === "number" ? typing.timestamp : 0;
        if (typing.isTyping && timestamp > fiveSecondsAgo) {
            isTyping = true;
        }
    });

    return isTyping;
}

// ============ REAL-TIME LISTENERS ============

export function subscribeToMessages(
    conversationId: string,
    callback: (messages: (FirebaseMessage & { id: string })[]) => void
) {
    const db = getFirebaseDatabase();
    const messagesRef = ref(db, `messages/${conversationId}`);
    const messagesQuery = query(messagesRef, orderByChild("createdAt"), limitToLast(50));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const messages = snapshotToArray<FirebaseMessage>(snapshot)
            .filter((m) => !m.isDeleted)
            .sort((a, b) => {
                const aTime = typeof a.createdAt === "number" ? a.createdAt : 0;
                const bTime = typeof b.createdAt === "number" ? b.createdAt : 0;
                return aTime - bTime;
            });

        callback(messages);
    });

    return unsubscribe;
}

export function subscribeToConversations(
    callback: (conversations: (FirebaseConversation & { id: string })[]) => void
) {
    const db = getFirebaseDatabase();
    const conversationsRef = ref(db, "conversations");

    const unsubscribe = onValue(
        conversationsRef,
        (snapshot) => {
            if (!snapshot.exists()) {
                callback([]);
                return;
            }

            const conversations = snapshotToArray<FirebaseConversation>(snapshot)
                .filter((c) => c.isActive)
                .sort((a, b) => {
                    const aTime = typeof a.lastMessageAt === "number" ? a.lastMessageAt : 0;
                    const bTime = typeof b.lastMessageAt === "number" ? b.lastMessageAt : 0;
                    return bTime - aTime;
                });

            callback(conversations);
        },
        (error) => {
            console.error("Firebase subscribeToConversations error:", error);
            callback([]);
        }
    );

    return unsubscribe;
}

export function subscribeToPresence(
    userId: string,
    callback: (presence: FirebasePresence | null) => void
) {
    const db = getFirebaseDatabase();
    const presenceRef = ref(db, `presence/${userId}`);

    const unsubscribe = onValue(presenceRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback(null);
            return;
        }
        callback(snapshot.val() as FirebasePresence);
    });

    return unsubscribe;
}

export function subscribeToTyping(
    conversationId: string,
    excludeUserId: string,
    callback: (isTyping: boolean) => void
) {
    const db = getFirebaseDatabase();
    const typingRef = ref(db, `typing/${conversationId}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback(false);
            return;
        }

        let isTyping = false;
        const fiveSecondsAgo = Date.now() - 5000;

        snapshot.forEach((child) => {
            if (child.key === excludeUserId) return;
            const typing = child.val() as FirebaseTyping;
            const timestamp = typeof typing.timestamp === "number" ? typing.timestamp : 0;
            if (typing.isTyping && timestamp > fiveSecondsAgo) {
                isTyping = true;
            }
        });

        callback(isTyping);
    });

    return unsubscribe;
}

export function subscribeToUserConversation(
    userId: string,
    callback: (conversation: (FirebaseConversation & { id: string }) | null) => void
) {
    const db = getFirebaseDatabase();
    const conversationsRef = ref(db, "conversations");

    const unsubscribe = onValue(
        conversationsRef,
        (snapshot) => {
            if (!snapshot.exists()) {
                callback(null);
                return;
            }

            let found: (FirebaseConversation & { id: string }) | null = null;
            snapshot.forEach((child) => {
                const conv = child.val() as FirebaseConversation;
                if (conv.participantId === userId && conv.isActive) {
                    found = { id: child.key!, ...conv };
                }
            });

            callback(found);
        },
        (error) => {
            console.error("Firebase subscribeToUserConversation error:", error);
            callback(null);
        }
    );

    return unsubscribe;
}
