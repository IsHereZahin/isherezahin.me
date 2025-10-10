"use client";

import { StaticImageData } from 'next/image';
import { useEffect } from 'react';
import BlurImage from './BlurImage';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    src: string | StaticImageData;
    alt: string;
}

export default function ImageModal({ isOpen, onClose, src, alt }: Readonly<ImageModalProps>) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-background/180 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Close button on top-right of the screen */}
            <button
                className="fixed top-4 right-4 text-foreground bg-muted-foreground/50 hover:bg-muted-foreground/70 rounded-full p-2 transition-colors z-50 cursor-pointer"
                onClick={onClose}
                aria-label="Close modal"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Image container */}
            <div className="relative w-full h-full max-w-4xl max-h-4xl" onClick={onClose}>
                <BlurImage
                    src={src}
                    alt={alt}
                    className="object-contain cursor-zoom-out"
                />
            </div>

            {/* Footer hint */}
            <div className="mt-4 text-center">
                <p className="text-muted-foreground/50 text-sm">
                    Press{' '}
                    <kbd className="px-2 py-1 bg-foreground/10 rounded border border-foreground/20 text-foreground/70 text-xs">
                        ESC
                    </kbd>{' '}
                    or click outside to close
                </p>
            </div>
        </div>
    );
}
