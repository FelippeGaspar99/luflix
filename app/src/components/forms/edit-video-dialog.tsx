"use client";

import { useActionState, useEffect, useState } from "react";
import { updateVideoAction } from "@/app/(private)/admin/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { defaultActionState } from "@/types/actions";
import { Modal } from "@/components/ui/modal";
import { Pencil } from "lucide-react";

interface Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string | null;
    attachmentUrl?: string | null;
    sortOrder: number;
}

interface Props {
    moduleId: string;
    video: Video;
}

export function EditVideoDialog({ moduleId, video }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useActionState(updateVideoAction, defaultActionState);

    useEffect(() => {
        if (state.success) {
            setIsOpen(false);
        }
    }, [state.success]);

    return (
        <>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(true)}
                className="h-8 px-2 text-xs text-slate-400 hover:text-white"
            >
                <Pencil size={14} className="mr-1" />
                Editar
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Editar Vídeo">
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="moduleId" value={moduleId} />
                    <input type="hidden" name="videoId" value={video.id} />

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Título do vídeo</label>
                        <Input name="title" defaultValue={video.title} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Descrição</label>
                        <Textarea name="description" rows={3} defaultValue={video.description} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Link (YouTube ou Google Drive)</label>
                        <Input name="videoUrl" type="url" defaultValue={video.videoUrl} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">URL da Capa (Opcional)</label>
                        <Input name="thumbnailUrl" type="url" defaultValue={video.thumbnailUrl || ""} placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Anexo (PDF/Documento) - Opcional</label>
                        <Input name="attachmentUrl" type="url" defaultValue={video.attachmentUrl || ""} placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Ordem de exibição</label>
                        <Input name="sortOrder" type="number" min={0} defaultValue={video.sortOrder} />
                    </div>

                    {(state as any).error && <p className="text-sm text-red-400">{(state as any).error}</p>}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1">
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
