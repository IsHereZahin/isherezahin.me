// Static legal content. These pages are intentionally hardcoded (not
// database-driven) — edit the text here to update the published pages.
import { BASE_URL, MY_FULL_NAME, MY_MAIL } from "@/lib/constants";

export interface LegalDoc {
    title: string;
    subtitle: string;
    /** Human-readable date shown as "Last updated". Bump this when you edit the text. */
    lastUpdated: string;
    /** Markdown body. */
    content: string;
}

export const PRIVACY_POLICY: LegalDoc = {
    title: "Privacy Policy",
    subtitle: "How your information is collected, used, and protected on this site",
    lastUpdated: "July 19, 2026",
    content: `This Privacy Policy explains how ${MY_FULL_NAME} ("I", "me", or "we") collects, uses, and protects your information when you visit ${BASE_URL} (the "Site"). By using the Site, you agree to the practices described below.

## 1. Information I Collect

**Information you provide**

- **Newsletter** — if you subscribe, I store your email address (verified with a one-time code) so I can send occasional updates. You can unsubscribe at any time.
- **Account sign-in** — if you sign in with GitHub or Google, I receive your name, email address, profile picture, and a provider account ID. This lets you comment, sign the guestbook, and chat.
- **Comments & discussions** — comments are handled through GitHub Discussions and are publicly visible alongside your GitHub profile.
- **Messages** — if you write through the contact form or live chat, I store the message so I can read and reply.

**Information collected automatically**

- **Usage analytics** — I record limited, aggregated data about visits: which pages are viewed, the referring website, a general device type (e.g. mobile or desktop), and a country derived from your IP address. Visits are de-duplicated using a short-lived, hashed identifier. I do not build advertising profiles and I do not sell any data.
- **Local storage** — small values are stored in your browser, such as your theme preference and an anonymous device identifier used to prevent duplicate "likes".
- **Cookies** — a secure session cookie is set only when you sign in, to keep you logged in.

## 2. How I Use Your Information

- To operate the Site and display its content.
- To send newsletter emails you have requested, and to honor unsubscribes.
- To enable comments, the guestbook, likes, and live chat.
- To understand, in aggregate, how the Site is used and to improve it.
- To respond to your messages and inquiries.
- To protect the Site against spam, abuse, and fraud.

I do not sell your personal information, and I do not use it for third-party advertising.

## 3. Third-Party Services

The Site relies on trusted third parties that process data on my behalf, each under their own privacy policies:

- **GitHub** and **Google** — sign-in, and (for GitHub) comments and discussions.
- **Cloudinary** — image hosting and delivery.
- **Google Firebase** — live chat and presence.
- **MongoDB** — database storage.
- **An email delivery provider** — sending newsletter and verification emails.
- **The Site's hosting provider** — serving the website.

## 4. Data Retention

I keep personal information only as long as needed for the purposes above — for example, newsletter emails until you unsubscribe, and account or message data while your account or conversation is active. Aggregated analytics may be kept indefinitely because it does not identify you.

## 5. Your Rights & Choices

- **Unsubscribe** from the newsletter at any time using the link in any email, or by contacting me.
- **Access or delete** the personal data tied to your account or messages by contacting me at ${MY_MAIL}.
- **Clear local storage and cookies** through your browser settings at any time.

Depending on where you live, you may have additional rights (for example, under the GDPR). I will honor valid requests to the extent required by law.

## 6. Data Security

I take reasonable technical measures to protect your information, including encryption in transit (HTTPS) and access controls. However, no method of transmission or storage is completely secure, and I cannot guarantee absolute security.

## 7. Children's Privacy

The Site is not directed to children under 13, and I do not knowingly collect their personal information. If you believe a child has provided personal information, please contact me and I will delete it.

## 8. International Visitors

The Site is operated from Bangladesh. If you access it from elsewhere, your information may be processed in countries whose data-protection laws differ from your own.

## 9. Changes to This Policy

I may update this Privacy Policy from time to time. Material changes are reflected by the "Last updated" date above. Continuing to use the Site after changes take effect means you accept the updated policy.

## 10. Contact

If you have any questions about this Privacy Policy, contact me at **${MY_MAIL}**.`,
};

export const TERMS_OF_SERVICE: LegalDoc = {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using this site",
    lastUpdated: "July 19, 2026",
    content: `These Terms of Service ("Terms") govern your access to and use of ${BASE_URL} (the "Site"), operated by ${MY_FULL_NAME}. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.

## 1. Use of the Site

You may browse and read the Site for personal, non-commercial purposes. You agree **not** to:

- Use the Site in any way that violates applicable laws or regulations.
- Attempt to gain unauthorized access to the Site, its accounts, or its systems.
- Interfere with or disrupt the Site — including automated scraping, denial-of-service attempts, or spamming forms and comments.
- Upload or transmit malicious code, or content that is unlawful, harmful, or infringing.

## 2. Accounts

Some features (such as commenting, the guestbook, or chat) require signing in with a third-party provider (GitHub or Google). You are responsible for activity under your account and for complying with that provider's terms. I may suspend or remove access for conduct that violates these Terms.

## 3. User Content

If you post comments, guestbook entries, or chat messages ("User Content"), you are solely responsible for it and confirm you have the right to share it. You grant me a non-exclusive, worldwide, royalty-free license to store and display your User Content for the purpose of operating the Site. I may remove any User Content I consider inappropriate, unlawful, or in violation of these Terms, at my discretion and without notice.

## 4. Intellectual Property

Unless otherwise stated, all content on the Site — including text, articles, project write-ups, design, graphics, and code samples — is owned by ${MY_FULL_NAME} and protected by intellectual-property laws. You may share links to the Site and quote short excerpts with attribution, but you may not copy, republish, or redistribute substantial portions without prior written permission.

## 5. Newsletter

By subscribing to the newsletter, you consent to receive occasional emails. You can unsubscribe at any time using the link in any email. See the Privacy Policy for how your email is handled.

## 6. Third-Party Links & Services

The Site may link to third-party websites and relies on third-party services. I am not responsible for the content, policies, or practices of any third party, and accessing them is at your own risk.

## 7. Disclaimer

The Site and its content are provided "as is" and "as available", without warranties of any kind, whether express or implied, including accuracy, fitness for a particular purpose, or non-infringement. Content is provided for general information and does not constitute professional advice.

## 8. Limitation of Liability

To the fullest extent permitted by law, ${MY_FULL_NAME} shall not be liable for any indirect, incidental, or consequential damages, or any loss of data or profits, arising out of your use of — or inability to use — the Site.

## 9. Changes to These Terms

I may revise these Terms from time to time. Changes take effect when posted, as reflected by the "Last updated" date above. Continuing to use the Site after changes take effect means you accept the revised Terms.

## 10. Governing Law

These Terms are governed by the laws of Bangladesh, without regard to its conflict-of-law principles.

## 11. Contact

Questions about these Terms? Contact me at **${MY_MAIL}**.`,
};
