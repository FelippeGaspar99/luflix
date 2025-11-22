'use client';

import { useState, useRef, useMemo } from 'react';
import { Search } from 'lucide-react';
import { VideoPlayer } from '@/components/video/video-player';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModuleCourseViewerProps {
  videos: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string | null;
    attachmentUrl?: string | null;
  }[];
  progress?: Record<string, number>;
}

export function ModuleCourseViewer({ videos, progress }: ModuleCourseViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playSignal, setPlaySignal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const playCounter = useRef(0);

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;

    const query = searchQuery.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  if (videos.length === 0) {
    return <p className="text-slate-500">Nenhum vídeo cadastrado neste módulo.</p>;
  }

  const goTo = (index: number) => {
    // Find the actual index in the full videos array
    const videoId = filteredVideos[index]?.id;
    const actualIndex = videos.findIndex(v => v.id === videoId);

    if (actualIndex !== -1) {
      setCurrentIndex(actualIndex);
      playCounter.current += 1;
      setPlaySignal(`${videos[actualIndex].id}-${playCounter.current}`);
    }
  };

  const currentVideo = videos[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < videos.length - 1;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content Area */}
      <div className="space-y-6 lg:col-span-2">
        <VideoPlayer
          videoId={currentVideo.id}
          url={currentVideo.videoUrl}
          trackProgress={false}
          playSignal={playSignal}
        />

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{currentVideo.title}</h2>
              <p className="text-sm text-slate-400">{currentVideo.description}</p>

              {/* Attachment Download */}
              {currentVideo.attachmentUrl && (
                <a
                  href={currentVideo.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar Material
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={!canGoPrev} onClick={() => setCurrentIndex(currentIndex - 1)}>
                Anterior
              </Button>
              <Button variant="secondary" disabled={!canGoNext} onClick={() => setCurrentIndex(currentIndex + 1)}>
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Playlist */}
      <div className="lg:col-span-1">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="mb-4 space-y-3">
            <h3 className="font-semibold text-white">Neste módulo</h3>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="text"
                placeholder="Buscar vídeos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 bg-slate-900/60 pl-9 text-sm placeholder:text-slate-500"
              />
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">
              Nenhum vídeo encontrado
            </p>
          ) : (
            <ul className="max-h-[600px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {filteredVideos.map((video) => {
                const actualIndex = videos.findIndex(v => v.id === video.id);
                const isCurrentVideo = actualIndex === currentIndex;

                return (
                  <li
                    key={video.id}
                    className={`group flex cursor-pointer gap-3 rounded-xl p-3 transition hover:bg-slate-800/50 ${isCurrentVideo ? 'bg-rose-500/10 ring-1 ring-rose-500/50' : ''
                      }`}
                    onClick={() => {
                      setCurrentIndex(actualIndex);
                      playCounter.current += 1;
                      setPlaySignal(`${video.id}-${playCounter.current}`);
                    }}
                  >
                    <div className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-900">
                      {/* Lógica de Thumbnail */}
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                        />
                      ) : video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                        <img
                          src={`https://img.youtube.com/vi/${video.videoUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)?.[1]
                            }/mqdefault.jpg`}
                          alt=""
                          className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-800" />
                      )}

                      <span className="relative z-10 text-xs font-medium text-white drop-shadow-md">
                        #{actualIndex + 1}
                      </span>
                      {isCurrentVideo && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                          <div className="h-3 w-3 animate-pulse rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                      <p className={`line-clamp-2 text-sm font-medium ${isCurrentVideo ? 'text-rose-200' : 'text-slate-300 group-hover:text-white'
                        }`}>
                        {video.title}
                      </p>
                      {typeof progress?.[video.id] === 'number' && (
                        <span className={`text-xs ${progress[video.id] >= 100 ? 'text-emerald-400' : 'text-slate-500'
                          }`}>
                          {progress[video.id] >= 100 ? 'Concluído' : `${progress[video.id]}% assistido`}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
