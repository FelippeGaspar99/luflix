'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { defaultActionState } from '@/types/actions';
import { saveVideoConfigAction } from '@/app/(private)/admin/video/actions';

interface VideoConfigFormProps {
  initialValues?: {
    videoUrl: string;
    posterUrl?: string | null;
  };
  redirectPath?: string;
}

export function VideoConfigForm({ initialValues, redirectPath }: VideoConfigFormProps) {
  const [state, formAction] = useActionState(saveVideoConfigAction, defaultActionState);

  return (
    <form action={formAction} className="space-y-5">
      {redirectPath && <input type="hidden" name="redirect_path" value={redirectPath} />}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">URL do vídeo</label>
        <Input
          name="video_url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          defaultValue={initialValues?.videoUrl ?? ''}
          required
        />
        <p className="text-xs text-slate-500">Aceita YouTube, Google Drive ou link direto para MP4.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">URL da capa (opcional)</label>
        <Input
          name="poster_url"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.posterUrl ?? ''}
        />
      </div>

      {(state as any).error && <div className="text-red-400 text-sm">{(state as any).error}</div>}
      {state.success && <p className="text-sm text-emerald-400">Configuração salva!</p>}

      <Button type="submit" className="w-full">
        Salvar vídeo
      </Button>
    </form>
  );
}
