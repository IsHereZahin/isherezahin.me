import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import { Home } from 'lucide-react';
import MotionWrapper from './motion/MotionWrapper';

export default function ComingSoon() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <MotionWrapper delay={0.2}>
                <Heading text="Coming Soon..." size="md" />
            </MotionWrapper>
            {/* Message */}
            <MotionWrapper delay={0.4}>

                <h2 className="text-base font-semibold text-secondary-foreground mb-4">
                    We’re working hard to bring something amazing!
                </h2>

            </MotionWrapper>
            {/* Go Home Button */}
            <MotionWrapper delay={0.6}>

                <Button href="/" text="Go Back Home" icon={<Home className="h-4 w-4" />} />
            </MotionWrapper>
        </div>
    );
}