'use client';

import { useActionState } from "react";
import { createVideoAction } from "@/app/(private)/admin/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { defaultActionState } from "@/types/actions";

interface Props {
  moduleId: string;
}

export function VideoForm({ moduleId }: Props) {
  const [state, formAction] = useActionState(createVideoAction, defaultActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="moduleId" value={moduleId} />
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Título do vídeo</label>
        <Input name="title" placeholder="Introdução" required />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Descrição</label>
        <Textarea name="description" rows={3} placeholder="O que será abordado" required />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Link (YouTube ou Google Drive)</label>
        <Input name="videoUrl" type="url" placeholder="https://" required />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">URL da Capa (Opcional)</label>
        <Input name="thumbnailUrl" type="url" placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Anexo (PDF/Documento) - Opcional</label>
        <Input name="attachmentUrl" type="url" placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Ordem de exibição</label>
        <Input name="sortOrder" type="number" min={0} defaultValue={0} />
      </div>
      {(state as any).error && <p className="text-sm text-red-400">{(state as any).error}</p>}
      <Button type="submit" className="w-full">
        Adicionar vídeo
      </Button>
    </form>
  );
}
