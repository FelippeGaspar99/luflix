import { requireEmployee } from "@/auth/guards";
import { getModulesForEmployee } from "@/controllers/moduleController";
import { getModuleProgress } from "@/controllers/progressController";
import { ModuleCard } from "@/components/modules/module-card";

export default async function EmployeePage() {
  const session = await requireEmployee();
  const modules = await getModulesForEmployee(session.user.id);

  if (modules.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#05070e] to-[#0b1224] px-6 text-center text-slate-300">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 px-10 py-12 text-lg">
          Nenhum curso liberado para você ainda.
        </div>
      </div>
    );
  }

  const modulesWithProgress = await Promise.all(
    modules.map(async (module: any) => {
      const progress = await getModuleProgress(session.user.id, module.id);
      return {
        id: module.id,
        title: module.title,
        description: module.description,
        coverUrl: module.coverUrl,
        videosCount: module.videos?.length ?? 0,
        progress: Math.round(progress.percentage),
      };
    }),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070e] to-[#0b1224] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Área de membros</p>
          <h1 className="text-3xl font-semibold text-white">Meus cursos</h1>
          <p className="text-slate-400">Aqui estão apenas os cursos liberados para você. Escolha um para assistir.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modulesWithProgress.map((module) => (
            <ModuleCard
              key={module.id}
              href={`/modules/${module.id}`}
              title={module.title}
              description={module.description}
              coverUrl={module.coverUrl}
              videosCount={module.videosCount}
              progress={module.progress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
