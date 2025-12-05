// src/lib/cloudinary-utils.ts
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '@/lib/constants';
import crypto from 'crypto';

/**
 * Delete an image from Cloudinary by URL
 * @param imageUrl - The Cloudinary image URL to delete
 * @returns true if deleted successfully, false otherwise
 */
export async function deleteCloudinaryImage(imageUrl: string): Promise<boolean> {
    try {
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            console.error('Cloudinary not configured');
            return false;
        }

        if (!imageUrl) {
            return false;
        }

        // Only delete if it's a Cloudinary URL
        if (!imageUrl.includes('cloudinary.com')) {
            return true; // Not a Cloudinary image, skip deletion
        }

        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            console.error('Invalid Cloudinary URL:', imageUrl);
            return false;
        }

        // Get everything after 'upload/v{version}/'
        const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
        const public_id = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Remove file extension

        // Generate signature for deletion
        const timestamp = Math.round(Date.now() / 1000);
        const signatureString = `public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

        // Delete from Cloudinary
        const deleteFormData = new FormData();
        deleteFormData.append('public_id', public_id);
        deleteFormData.append('api_key', CLOUDINARY_API_KEY);
        deleteFormData.append('timestamp', timestamp.toString());
        deleteFormData.append('signature', signature);

        const deleteResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: 'POST',
                body: deleteFormData,
            }
        );

        const result = await deleteResponse.json();
        return result.result === 'ok' || result.result === 'not found';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}
