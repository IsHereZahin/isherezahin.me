// src/lib/vault/files.ts
// File byte storage for the vault using MongoDB GridFS. Bytes never leave the
// app: they are written/read only through these helpers, behind requireVault().

import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Readable } from "stream";
import dbConnect from "@/database/services/mongo";

const BUCKET_NAME = "vault_files";

async function getBucket(): Promise<GridFSBucket> {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not ready");
    return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

// Store a buffer; returns the GridFS file id as a string (used as storageKey).
export async function uploadVaultFile(
    buffer: Buffer,
    filename: string,
    contentType: string
): Promise<string> {
    const bucket = await getBucket();
    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, { contentType });
        Readable.from(buffer)
            .pipe(uploadStream)
            .on("error", reject)
            .on("finish", () => resolve(uploadStream.id.toString()));
    });
}

// Read the full file back into a buffer (files are size-capped, so this is safe).
export async function readVaultFile(storageKey: string): Promise<Buffer> {
    const bucket = await getBucket();
    const chunks: Buffer[] = [];
    const downloadStream = bucket.openDownloadStream(new ObjectId(storageKey));
    return new Promise((resolve, reject) => {
        downloadStream
            .on("data", (chunk: Buffer) => chunks.push(chunk))
            .on("error", reject)
            .on("end", () => resolve(Buffer.concat(chunks)));
    });
}

export async function deleteVaultFile(storageKey: string): Promise<void> {
    try {
        const bucket = await getBucket();
        await bucket.delete(new ObjectId(storageKey));
    } catch (error) {
        // Already gone; don't block metadata deletion.
        console.error("Failed to delete vault file bytes:", error);
    }
}
