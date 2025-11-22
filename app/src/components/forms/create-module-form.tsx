'use client';

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createModuleAction } from "@/app/(private)/admin/actions";
import { defaultActionState } from "@/types/actions";

export function CreateModuleForm() {
  const [state, formAction] = useActionState(createModuleAction, defaultActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Título</label>
          <Input name="title" placeholder="Onboarding" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Capa (URL)</label>
          <Input name="coverUrl" placeholder="https://" type="url" required />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Descrição</label>
        <Textarea name="description" rows={4} placeholder="Detalhes do módulo" required />
      </div>
      {(state as any).error && <p className="text-sm text-red-400">{(state as any).error}</p>}
      <Button type="submit" className="w-full">Cadastrar módulo</Button>
    </form>
  );
}
