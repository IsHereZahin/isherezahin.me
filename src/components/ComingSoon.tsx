import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import { Home } from 'lucide-react';

export default function ComingSoon() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <Heading text="Coming Soon..." size="md" />

            {/* Message */}
            <h2 className="text-base font-semibold text-secondary-foreground mb-4">
                We’re working hard to bring something amazing!
            </h2>

            {/* Go Home Button */}
            <Button href="/" text="Go Back Home" icon={<Home className="h-4 w-4" />} />
        </div>
    );
}