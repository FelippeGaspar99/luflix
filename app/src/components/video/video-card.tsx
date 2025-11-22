'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, CheckCircle } from 'lucide-react';

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  videoUrl: string;
  progress?: number;
  isCompleted?: boolean;
  isActive?: boolean;
  index: number;
}

export function VideoCard({
  id,
  title,
  description,
  thumbnailUrl,
  videoUrl,
  progress = 0,
  isCompleted = false,
  isActive = false,
  index,
}: VideoCardProps) {
  // Helper to get YouTube thumbnail if no custom thumbnail is provided
  const getThumbnail = () => {
    if (thumbnailUrl) return thumbnailUrl;
    
    try {
      const url = new URL(videoUrl);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    } catch {
      // ignore invalid urls
    }
    
    return '/placeholder-video.jpg'; // You might need a placeholder asset
  };

  const displayThumbnail = getThumbnail();

  return (
    <Link 
      href={`?video=${id}`} 
      className={`group relative block flex-shrink-0 w-[280px] transition-all duration-300 hover:scale-105 ${
        isActive ? 'ring-2 ring-rose-500 rounded-xl' : ''
      }`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900 shadow-lg">
        {/* Thumbnail Image */}
        {displayThumbnail && (
          <img
            src={displayThumbnail}
            alt={title}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
          />
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play Icon (centered on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-rose-600 p-3 shadow-lg">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
          <div 
            className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-rose-600'}`} 
            style={{ width: `${isCompleted ? 100 : progress}%` }} 
          />
        </div>

        {/* Duration / Status Badge (Optional) */}
        {isCompleted && (
          <div className="absolute top-2 right-2 rounded bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            CONCLUÍDO
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className={`text-sm font-medium leading-tight ${isActive ? 'text-rose-400' : 'text-slate-200 group-hover:text-white'}`}>
          {index + 1}. {title}
        </h3>
        <p className="line-clamp-2 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
}
