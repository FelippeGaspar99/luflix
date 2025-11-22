'use client';

import { useTransition } from 'react';
import { deleteVideoAction, updateVideoOrderAction } from '@/app/(private)/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getVideoHost } from '@/videos/helpers';
import { EditVideoDialog } from '@/components/forms/edit-video-dialog';

interface ModuleVideoTableProps {
  moduleId: string;
  videos: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string | null;
    sortOrder: number;
  }[];
}

export function ModuleVideoTable({ moduleId, videos }: ModuleVideoTableProps) {
  const [isPending, startTransition] = useTransition();

  if (videos.length === 0) {
    return <p className="text-sm text-slate-500">Ainda não há vídeos cadastrados.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
      <table className="min-w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.3em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Ordem</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Origem</th>
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="border-t border-slate-800/40">
              <td className="px-4 py-3 align-top text-slate-400">
                <form action={updateVideoOrderAction.bind(null, null) as any} className="flex items-center gap-2">
                  <input type="hidden" name="moduleId" value={moduleId} />
                  <input type="hidden" name="videoId" value={video.id} />
                  <Input
                    name="sortOrder"
                    type="number"
                    defaultValue={video.sortOrder}
                    className="w-16 text-center"
                  />
                  <Button type="submit" variant="ghost" className="text-xs">
                    Atualizar
                  </Button>
                </form>
              </td>
              <td className="px-4 py-3 align-top font-semibold text-white">{video.title}</td>
              <td className="px-4 py-3 align-top text-slate-400">{getVideoHost(video.videoUrl)}</td>
              <td className="px-4 py-3 align-top text-slate-400">{video.description}</td>
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-3">
                  <Button asChild variant="secondary" className="text-xs">
                    <a href={video.videoUrl} target="_blank" rel="noreferrer">
                      Abrir link
                    </a>
                  </Button>

                  <EditVideoDialog moduleId={moduleId} video={video} />

                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await deleteVideoAction(video.id, moduleId);
                      })
                    }
                    className="text-xs text-rose-400 hover:text-white"
                  >
                    Remover
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
