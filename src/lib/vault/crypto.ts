// src/lib/vault/crypto.ts
// All Personal Vault cryptography, built on Node's built-in `crypto` (no extra deps).
//
// Key model (KEK/DEK envelope):
//   password --scrypt(kdfSalt)--> KEK  --AES-256-GCM--> wraps DEK (random 32 bytes)
//   DEK encrypts the actual sensitive data (credentials, encrypted notes).
// Changing the password only re-wraps the DEK; data never needs re-encryption.

import crypto from "crypto";
import { AUTH_SECRET } from "@/lib/constants";

export interface EncBlob {
    ciphertext: string; // base64
    iv: string; // base64
    authTag: string; // base64
}

const SCRYPT_KEYLEN = 32;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } as const;

function scrypt(password: string, salt: Buffer): Buffer {
    return crypto.scryptSync(password, salt, SCRYPT_KEYLEN, {
        ...SCRYPT_PARAMS,
        // Default maxmem (32MB) is too low for N=16384; raise it.
        maxmem: 64 * 1024 * 1024,
    });
}

// ---------- Password verification (separate from encryption keys) ----------

export function hashPassword(password: string): {
    passwordHash: string;
    passwordSalt: string;
} {
    const salt = crypto.randomBytes(16);
    const hash = scrypt(password, salt);
    return {
        passwordHash: hash.toString("base64"),
        passwordSalt: salt.toString("base64"),
    };
}

export function verifyPassword(
    password: string,
    passwordHash: string,
    passwordSalt: string
): boolean {
    if (!passwordHash || !passwordSalt) return false;
    try {
        const salt = Buffer.from(passwordSalt, "base64");
        const expected = Buffer.from(passwordHash, "base64");
        const actual = scrypt(password, salt);
        if (actual.length !== expected.length) return false;
        return crypto.timingSafeEqual(actual, expected);
    } catch {
        return false;
    }
}

// ---------- Key-Encryption-Key derivation ----------

export function generateKdfSalt(): string {
    return crypto.randomBytes(16).toString("base64");
}

export function deriveKEK(password: string, kdfSalt: string): Buffer {
    return scrypt(password, Buffer.from(kdfSalt, "base64"));
}

// ---------- Generic AES-256-GCM encrypt/decrypt with a 32-byte key ----------

export function encryptWithKey(plaintext: string, key: Buffer): EncBlob {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    return {
        ciphertext: ciphertext.toString("base64"),
        iv: iv.toString("base64"),
        authTag: cipher.getAuthTag().toString("base64"),
    };
}

export function decryptWithKey(blob: EncBlob, key: Buffer): string {
    const iv = Buffer.from(blob.iv, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(Buffer.from(blob.authTag, "base64"));
    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(blob.ciphertext, "base64")),
        decipher.final(),
    ]);
    return plaintext.toString("utf8");
}

// ---------- DEK lifecycle ----------

export function generateDEK(): Buffer {
    return crypto.randomBytes(32);
}

export function wrapDEK(dek: Buffer, kek: Buffer): EncBlob {
    return encryptWithKey(dek.toString("base64"), kek);
}

export function unwrapDEK(wrapped: EncBlob, kek: Buffer): Buffer {
    return Buffer.from(decryptWithKey(wrapped, kek), "base64");
}

// Data encryption helpers (operate on the unlocked DEK passed around per-request).
export function encryptData(plaintext: string, dek: Buffer): EncBlob {
    return encryptWithKey(plaintext, dek);
}

export function decryptData(blob: EncBlob, dek: Buffer): string {
    return decryptWithKey(blob, dek);
}

// ---------- Session cookie sealing (key derived from AUTH_SECRET) ----------

function cookieKey(): Buffer {
    if (!AUTH_SECRET) {
        throw new Error("AUTH_SECRET is not set; cannot seal vault session");
    }
    // Deterministic 32-byte key from the app secret.
    return crypto.createHash("sha256").update(`vault:${AUTH_SECRET}`).digest();
}

// Produces a compact "iv.tag.ciphertext" base64url token.
export function sealCookie(payload: object): string {
    const key = cookieKey();
    const blob = encryptWithKey(JSON.stringify(payload), key);
    const toB64Url = (b64: string) =>
        b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return [blob.iv, blob.authTag, blob.ciphertext].map(toB64Url).join(".");
}

export function openCookie<T = Record<string, unknown>>(token: string): T | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const fromB64Url = (s: string) =>
            s.replace(/-/g, "+").replace(/_/g, "/");
        const [iv, authTag, ciphertext] = parts.map(fromB64Url);
        const key = cookieKey();
        const json = decryptWithKey({ iv, authTag, ciphertext }, key);
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}
