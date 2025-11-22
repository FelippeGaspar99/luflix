'use client';

import { useActionState } from "react";
import { updateModuleAction } from "@/app/(private)/admin/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { defaultActionState } from "@/types/actions";

interface Props {
  module: {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
  };
}

export function EditModuleForm({ module }: Props) {
  const [state, formAction] = useActionState(updateModuleAction, defaultActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="moduleId" value={module.id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Título</label>
          <Input name="title" defaultValue={module.title} required />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Capa</label>
          <Input name="coverUrl" type="url" defaultValue={module.coverUrl} required />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Descrição</label>
        <Textarea name="description" rows={4} defaultValue={module.description} required />
      </div>
      {(state as any).error && <p className="text-sm text-red-400">{(state as any).error}</p>}
      <Button type="submit">Salvar alterações</Button>
    </form>
  );
}
