'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoCarouselProps {
    title: string;
    children: React.ReactNode;
}

export function VideoCarousel({ title, children }: VideoCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // Approximate width of a card
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="space-y-4 py-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>
        </div>
    );
}
