// src/app/api/cloudinary/route.ts
import { checkIsAdmin } from '@/lib/auth-utils';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '@/lib/constants';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Upload image/video to Cloudinary (signed upload)
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Determine resource type based on file mime type or file extension
        const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|m4v|flv|wmv)$/i;
        const isVideo = file.type.startsWith('video/') || videoExtensions.test(file.name);
        const resourceType = isVideo ? 'video' : 'image';

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Generate signature for signed upload
        const timestamp = Math.round(Date.now() / 1000);
        const folder = 'blog-uploads';

        // Create signature string (parameters must be in alphabetical order)
        const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

        // Upload to Cloudinary with signed request
        const uploadFormData = new FormData();
        uploadFormData.append('file', dataUri);
        uploadFormData.append('api_key', CLOUDINARY_API_KEY);
        uploadFormData.append('timestamp', timestamp.toString());
        uploadFormData.append('signature', signature);
        uploadFormData.append('folder', folder);

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
            {
                method: 'POST',
                body: uploadFormData,
            }
        );

        if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            console.error('Cloudinary upload error:', error);
            return NextResponse.json({ error: error.error?.message || 'Upload failed' }, { status: 500 });
        }

        const result = await uploadResponse.json();
        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: resourceType
        }, { status: 200 });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

// Delete image/video from Cloudinary
export async function DELETE(req: NextRequest) {
    try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get('url');

        if (!fileUrl) {
            return NextResponse.json({ error: 'No file URL provided' }, { status: 400 });
        }

        // Extract public_id and resource type from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{folder}/{public_id}.{format}
        const urlParts = fileUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            return NextResponse.json({ error: 'Invalid Cloudinary URL' }, { status: 400 });
        }

        // Determine resource type from URL (image or video)
        const resourceType = urlParts[uploadIndex - 1] === 'video' ? 'video' : 'image';

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
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`,
            {
                method: 'POST',
                body: deleteFormData,
            }
        );

        const result = await deleteResponse.json();

        if (result.result === 'ok' || result.result === 'not found') {
            return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });

    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
