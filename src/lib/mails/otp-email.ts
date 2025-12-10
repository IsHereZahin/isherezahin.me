import { MY_FULL_NAME, SITE_USER_LOGO } from "../constants";
import { sendEmail } from "./new-blog-notification";

interface OtpEmailData {
    otp: string;
    email: string;
}

export function generateOtpEmailTemplate(data: OtpEmailData): string {
    const { otp } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 500px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 24px;">
                            <img src="${SITE_USER_LOGO}" alt="Logo" style="width: 56px; height: 56px; border-radius: 50%; margin-bottom: 16px;" />
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a;">Verify Your Email</h1>
                            <p style="margin: 12px 0 0; font-size: 15px; color: #666666; line-height: 1.5;">Enter the code below to subscribe to our newsletter</p>
                        </td>
                    </tr>
                    
                    <!-- OTP Code -->
                    <tr>
                        <td align="center" style="padding: 8px 40px 32px;">
                            <div style="background-color: #f8f8f8; border-radius: 12px; padding: 24px 32px; display: inline-block;">
                                <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">${otp}</span>
                            </div>
                            <p style="margin: 16px 0 0; font-size: 13px; color: #888888;">This code expires in 10 minutes</p>
                        </td>
                    </tr>
                    
                    <!-- Info -->
                    <tr>
                        <td style="padding: 0 40px 32px;">
                            <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.6; text-align: center;">If you didn't request this code, you can safely ignore this email. Someone may have entered your email by mistake.</p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;" />
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 40px 32px;">
                            <p style="margin: 0; font-size: 13px; color: #888888;">© ${new Date().getFullYear()} ${MY_FULL_NAME}. All rights reserved.</p>
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

export async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
    const subject = `${otp} is your verification code`;
    const html = generateOtpEmailTemplate({ otp, email });

    return sendEmail({ to: email, subject, html });
}
