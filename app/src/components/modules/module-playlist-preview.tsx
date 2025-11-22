'use client';

import { useMemo, useState, useRef } from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video/video-player';

interface PlaylistPreviewProps {
  videos: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    sortOrder: number;
  }[];
  users: {
    id: string;
    name: string;
    email: string;
  }[];
  progressMap: Record<string, Record<string, number>>;
}

export function ModulePlaylistPreview({ videos, users, progressMap }: PlaylistPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playSignal, setPlaySignal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>(users[0]?.id ?? '');
  const playCounter = useRef(0);

  const currentVideo = videos[currentIndex];
  const currentProgress = selectedUser && currentVideo
    ? progressMap[selectedUser]?.[currentVideo.id] ?? 0
    : 0;

  const handleSelectVideo = (index: number) => {
    setCurrentIndex(index);
    playCounter.current += 1;
    setPlaySignal(`${videos[index].id}-${playCounter.current}`);
  };

  const rows = useMemo(() => {
    return videos.map((video, index) => {
      const progress = selectedUser ? progressMap[selectedUser]?.[video.id] ?? 0 : 0;
      return {
        ...video,
        index,
        progress,
        completed: progress >= 100,
      };
    });
  }, [videos, selectedUser, progressMap]);

  if (videos.length === 0) {
    return <p className="text-sm text-slate-500">Ainda não há vídeos neste módulo.</p>;
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < videos.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Visualizar como</p>
          <p className="text-sm text-slate-400">Selecione um colaborador para ver o progresso.</p>
        </div>
        <Select
          value={selectedUser}
          onChange={(event) => {
            setSelectedUser(event.target.value);
            setCurrentIndex(0);
            setPlaySignal(null);
          }}
          className="w-full max-w-xs"
        >
          {users.length === 0 && <option value="">Sem usuários</option>}
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>

      {currentVideo && (
        <div className="space-y-3 rounded-3xl border border-slate-800/60 bg-slate-900/50 p-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Reproduzindo</p>
              <h3 className="text-2xl font-semibold text-white">{currentVideo.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-400">Progresso:</span>
              <span className="font-semibold text-white">{currentProgress}%</span>
            </div>
          </div>
          <VideoPlayer
            key={currentVideo.id}
            videoId={currentVideo.id}
            url={currentVideo.videoUrl}
            trackProgress={false}
            playSignal={playSignal}
          />
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={!canGoPrev}
              onClick={() => handleSelectVideo(currentIndex - 1)}
            >
              ← Vídeo anterior
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!canGoNext}
              onClick={() => handleSelectVideo(currentIndex + 1)}
            >
              Próximo vídeo →
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800/50">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.3em] text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3">#</th>
                <th className="whitespace-nowrap px-4 py-3">Vídeo</th>
                <th className="whitespace-nowrap px-4 py-3">Progresso</th>
                <th className="whitespace-nowrap px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((video) => (
                <tr key={video.id} className="border-t border-slate-800/40">
                  <td className="whitespace-nowrap px-4 py-3">{video.index + 1}</td>
                  <td className="min-w-[200px] px-4 py-3">
                    <p className="font-semibold text-white">{video.title}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">{video.description}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    {selectedUser ? (
                      <span
                        className={`rounded-full px-3 py-1 font-semibold ${video.completed ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-800/70 text-slate-300'
                          }`}
                      >
                        {video.completed ? 'Concluído' : `${video.progress}%`}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button type="button" variant="secondary" onClick={() => handleSelectVideo(video.index)}>
                      Reproduzir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
