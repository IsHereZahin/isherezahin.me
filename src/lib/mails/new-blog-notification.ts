import nodemailer from "nodemailer";
import {
    BASE_DOMAIN,
    MAIL_FROM_NAME,
    MAIL_HOST,
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_USERNAME,
    MY_FULL_NAME,
    SITE_GITHUB_URL,
    SITE_USER_LOGO,
    SITE_X_URL
} from "../constants";

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

const createTransporter = () => {
    if (!MAIL_HOST || !MAIL_USERNAME || !MAIL_PASSWORD) {
        console.error("Mail configuration missing:", {
            hasHost: !!MAIL_HOST,
            hasUsername: !!MAIL_USERNAME,
            hasPassword: !!MAIL_PASSWORD
        });
        return null;
    }

    return nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: MAIL_PORT === 465, // true for port 465 (SSL), false for other ports
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
        },
    });
};

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
    const transporter = createTransporter();
    const fromName = MAIL_FROM_NAME || MY_FULL_NAME;
    const fromEmail = ` || newsletter@${BASE_DOMAIN}`;

    if (!transporter) {
        console.error("Mail configuration is incomplete");
        return false;
    }

    try {
        await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

interface NewBlogEmailData {
    blogTitle: string;
    blogExcerpt: string;
    blogSlug: string;
    blogImageSrc: string;
    publishedDate: string;
}

export function generateNewBlogEmailTemplate(data: NewBlogEmailData): string {
    const { blogTitle, blogExcerpt, blogSlug, blogImageSrc, publishedDate } = data;
    const blogUrl = `https://${BASE_DOMAIN}/blogs/${blogSlug}`;
    const unsubscribeUrl = `https://${BASE_DOMAIN}/profile/settings`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Blog Post</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo and Title -->
                    <tr>
                        <td align="left" style="padding: 32px 40px 24px;">
                            <table role="presentation" style="border-collapse: collapse;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 16px;">
                                        <img src="${SITE_USER_LOGO}" alt="Logo" style="width: 48px; height: 48px; border-radius: 50%;" />
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #1a1a1a;">New Blog Post Published</h1>
                                        <p style="margin: 4px 0 0; font-size: 14px; color: #666666;">Check out the latest article on <span style="color: #1a1a1a; font-weight: 600;">${blogTitle}</span></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Blog Image -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <img src="${blogImageSrc}" alt="${blogTitle}" style="width: 100%; height: auto; border-radius: 12px; object-fit: cover;" />
                        </td>
                    </tr>
                    
                    <!-- Blog Info -->
                    <tr>
                        <td style="padding: 20px 40px 0;">
                            <p style="margin: 0 0 4px; font-size: 18px; font-weight: 600; color: #1a1a1a;">${blogTitle}</p>
                            <p style="margin: 0 0 12px; font-size: 14px; color: #888888;">${publishedDate}</p>
                            <p style="margin: 0; font-size: 15px; color: #444444; line-height: 1.6;">${blogExcerpt}</p>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            <a href="${blogUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px;">Read Full Article</a>
                        </td>
                    </tr>
                    
                    <!-- Newsletter Notice -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.5;">You are receiving this email because you have enabled newsletter notifications for your account. If you no longer wish to receive these emails, please update your <a href="${unsubscribeUrl}" style="color: #1a1a1a; text-decoration: underline;">account settings</a>, you can unsubscribe.</p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 24px 40px 0;">
                            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;" />
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 40px 32px;">
                            <!-- Social Links -->
                            <table role="presentation" style="border-collapse: collapse; margin: 0 auto;">
                                <tr>
                                    <td style="padding-right: 16px;">
                                        <a href="${SITE_X_URL}" style="text-decoration: none;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="X" style="width: 20px; height: 20px; opacity: 0.6;" />
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${SITE_GITHUB_URL}" style="text-decoration: none;">
                                            <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" style="width: 20px; height: 20px; opacity: 0.6;" />
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 16px 0 0; font-size: 13px; color: #888888; text-align: center;">© ${new Date().getFullYear()} ${MY_FULL_NAME}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

export async function sendNewBlogNotification(
    blogData: NewBlogEmailData,
    subscriberEmails: string[]
): Promise<{ sent: number; failed: number }> {
    const subject = `New Blog: ${blogData.blogTitle}`;
    const html = generateNewBlogEmailTemplate(blogData);

    let sent = 0;
    let failed = 0;

    for (const email of subscriberEmails) {
        const success = await sendEmail({ to: email, subject, html });
        if (success) {
            sent++;
        } else {
            failed++;
        }
    }

    return { sent, failed };
}
