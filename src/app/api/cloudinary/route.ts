// src/app/api/cloudinary/route.ts
import { auth } from '@/auth';
import { MY_MAIL } from '@/lib/constants';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Upload image to Cloudinary (signed upload)
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const isAdmin = session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();
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
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
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
        return NextResponse.json({ url: result.secure_url, public_id: result.public_id }, { status: 200 });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

// Delete image from Cloudinary
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        const isAdmin = session?.user?.email?.toLowerCase() === MY_MAIL.toLowerCase();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const imageUrl = searchParams.get('url');
        
        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
        }

        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            return NextResponse.json({ error: 'Invalid Cloudinary URL' }, { status: 400 });
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
        
        if (result.result === 'ok' || result.result === 'not found') {
            return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });

    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
