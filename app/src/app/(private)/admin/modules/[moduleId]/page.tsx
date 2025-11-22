import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/auth/guards";
import { getModuleWithVideos } from "@/controllers/moduleController";
import { getEmployees } from "@/controllers/userController";
import { getModuleProgressSummary } from "@/controllers/progressController";
import { EditModuleForm } from "@/components/forms/edit-module-form";
import { VideoForm } from "@/components/forms/video-form";
import { AccessForm } from "@/components/forms/access-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteModuleButton } from "@/components/forms/delete-module-button";
import { cuidSchema } from "@/models/id";
import { ModuleVideoTable } from "@/components/modules/module-video-table";
import Link from "next/link";
import { updateMembersVisibilityAction } from "@/app/(private)/admin/actions";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModuleDetailPage({ params }: PageProps) {
  await requireAdmin();
  const resolvedParams = await params;
  const parsedId = cuidSchema.safeParse(resolvedParams?.moduleId);
  if (!parsedId.success) {
    notFound();
  }
  const moduleId = parsedId.data;
  const trainingModule = await getModuleWithVideos(moduleId);

  if (!trainingModule) {
    notFound();
  }

  const employees = await getEmployees();
  const summary = await getModuleProgressSummary(trainingModule.id);

  const grantedUsers = trainingModule.accesses.map((access) => ({
    id: access.user.id,
    name: access.user.name,
    email: access.user.email,
    progress:
      summary.totalVideos === 0
        ? 0
        : Math.round(
          ((summary.progressByUser[access.user.id] ?? 0) / summary.totalVideos) * 100,
        ),
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl lg:w-80">
              <Image src={trainingModule.coverUrl} alt={trainingModule.title} fill className="object-cover" />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Módulo</p>
              <h1 className="text-3xl font-bold text-white">{trainingModule.title}</h1>
              <p className="text-slate-400">{trainingModule.description}</p>
              <p className="text-sm text-slate-500">{trainingModule.videos.length} vídeos publicados</p>
              <DeleteModuleButton moduleId={trainingModule.id} />
            </div>
          </div>
        </Card>
        <Card className="space-y-4">
          <EditModuleForm module={trainingModule} />
          <form action={updateMembersVisibilityAction as any} className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
            <input type="hidden" name="moduleId" value={trainingModule.id} />
            <input type="hidden" name="visible" value={(!trainingModule.isMembersVisible).toString()} />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-400">Este módulo {trainingModule.isMembersVisible ? 'está disponível' : 'não está disponível'} na área de membros.</p>
              <Button type="submit" variant="secondary">
                {trainingModule.isMembersVisible ? 'Remover da área de membros' : 'Liberar na área de membros'}
              </Button>
            </div>
          </form>
          <Link
            href={`/members/modules/${trainingModule.id}`}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600"
          >
            Visualizar curso
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Progresso dos funcionários</h2>
              <p className="text-sm text-slate-500">Acompanhe quem já concluiu o módulo.</p>
            </div>
          </div>
          <div className="space-y-3">
            {grantedUsers.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum funcionário possui acesso ainda.</p>
            )}
            {grantedUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-800/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <p className="text-sm text-rose-300">{user.progress}%</p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-rose-500" style={{ width: `${user.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-slate-400">Controle de acesso</p>
          <AccessForm
            moduleId={trainingModule.id}
            employees={employees}
            granted={grantedUsers.map(({ id, name, email }) => ({ id, name, email: email || "" }))}
          />
        </Card>
      </div>

      <Card className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cadastro da playlist</p>
          <h2 className="text-2xl font-semibold text-white">Monte a sequência do curso</h2>
          <p className="text-sm text-slate-500">Adicione novos vídeos e ajuste a ordem exibida aos colaboradores.</p>
        </div>
        <VideoForm moduleId={trainingModule.id} />
        <ModuleVideoTable moduleId={trainingModule.id} videos={trainingModule.videos} />
      </Card>
    </div>
  );
}
