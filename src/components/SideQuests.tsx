"use client";

import { quests } from '@/data';
import { MapPin, Play } from 'lucide-react';
import { useState } from 'react';
import BlurImage from './ui/BlurImage';
import Section from './ui/Section';
import ExpandableText from './ui/ExpandableText';

export default function SideQuests() {
    const [selectedMedia, setSelectedMedia] = useState<Record<number, number>>({});

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    return (
        <Section id="side-quests" animate delay={0.1}>
            <div className="space-y-24">
                {quests.map((quest) => (
                    <div key={quest.id} className="relative">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="md:w-1/4">
                                <div className="sticky top-8">
                                    <p className="text-sm text-secondary-foreground uppercase tracking-wider mb-2">{quest.date}</p>
                                    <h3 className="text-3xl font-bold mb-2">{quest.title}</h3>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {quest.location}
                                    </p>
                                </div>
                            </div>

                            <div className="md:w-3/4">
                                <div className="shadow-feature-card rounded-2xl p-6">
                                    <div className="text-secondary-foreground leading-relaxed mb-6">
                                        <ExpandableText text={quest.description} limit={200} />
                                    </div>

                                    {/* Main Media Display */}
                                    <div className="relative rounded-xl overflow-hidden bg-gray-800/50 aspect-video mb-4">
                                        {(() => {
                                            const selectedIndex = selectedMedia[quest.id] ?? 0;
                                            const media = quest.media[selectedIndex];

                                            if (media.type === "video") {
                                                return (
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={getYouTubeEmbedUrl(media.src)}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                );
                                            }

                                            return <BlurImage src={media.src} alt={quest.title} />;
                                        })()}
                                    </div>

                                    {/* Thumbnail Grid */}
                                    <div className="grid grid-cols-4 gap-3">
                                        {quest.media.map((item, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => setSelectedMedia({ ...selectedMedia, [quest.id]: index })}
                                                className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${(selectedMedia[quest.id] === index || (selectedMedia[quest.id] === undefined && index === 0))
                                                    ? 'ring-2 ring-primary'
                                                    : 'opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                {item.type === 'video' ? (
                                                    <>
                                                        <BlurImage
                                                            src={item.thumbnail || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'}
                                                            alt={`Thumbnail ${index + 1}`}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <div className="size-5 xs:size-6 sm:size-7 md:size-8 lg:size-9 rounded-full bg-foreground/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                                                <Play
                                                                    className="size-3 xs:size-3.5 sm:size-4 md:size-5 lg:size-5 ml-0.5 text-primary"
                                                                    fill="currentColor"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <BlurImage
                                                        src={item.src}
                                                        alt={`Thumbnail ${index + 1}`}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}