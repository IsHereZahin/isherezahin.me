import { Button, ReferralLink, Section } from '@/components/ui';
import { FOOTER_MENU_ITEMS, SOCIAL_LINKS } from '@/config/links';
import { MY_NAME } from '@/lib/constants';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function SimpleFooter() {
    return (
        <Section id="footer" animate={true} delay={0.2}>
            <footer className="border-t border-border pt-12 pb-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Designed & Built with Typescript, React, Tailwind and Next.js ❤
                    </p>
                    <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                        Back to top <ArrowUpRight className="h-3 w-3" />
                    </a>
                </div>
            </footer>
        </Section>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <Section id="footer" animate={true}>
            <footer className="bg-background/10 text-foreground shadow-feature-card rounded-lg px-6 py-8 md:px-12 lg:px-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">{MY_NAME}</span>
                        </div>
                        <p className="text-sm text-secondary-foreground max-w-md">
                            Have a project in mind? I’ll respond within 6 hours.
                        </p>
                        <div className="flex space-x-4">
                            {SOCIAL_LINKS.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <ReferralLink key={link.href} href={link.href} className="hover:text-primary transition-colors">
                                        <Icon className="w-5 h-5 text-secondary-foreground hover:text-primary" />
                                    </ReferralLink>
                                );
                            })}
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {FOOTER_MENU_ITEMS.map((menuItem) => (
                            <div key={menuItem.category}>
                                <h3 className="text-base font-medium mb-4">{menuItem.category}</h3>
                                <ul className="space-y-2 text-sm">
                                    {menuItem.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="text-secondary-foreground hover:text-primary transition-colors block"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4 lg:col-span-1">
                        <h3 className="text-base font-medium mb-4">Subscribe to {MY_NAME}’s blog newsletter</h3>
                        <p className="text-sm text-secondary-foreground">
                            Get the latest news and updates delivered straight to your inbox.
                        </p>
                        <Button href="#" text="Subscribe" icon={<ArrowRight className="w-4 h-4" />} />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border pt-6 text-center flex flex-col md:flex-row justify-between items-center text-sm text-secondary-foreground">
                    <p>&copy; {currentYear} {MY_NAME}, all rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </Section>
    );
}