import { requireEmployee } from "@/auth/guards";
import { getModulesForEmployee } from "@/controllers/moduleController";
import { getModuleProgress } from "@/controllers/progressController";
import { ModuleGallery } from "@/views/members/module-gallery";

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
        createdAt: module.createdAt?.toISOString?.() ?? null,
        videos: module.videos?.map((video: any) => ({ title: video.title })) ?? [],
      };
    }),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070e] to-[#0b1224] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ModuleGallery
          modules={modulesWithProgress}
          baseHref="/modules"
          heading="Meus cursos"
          subheading="Aqui estão apenas os cursos liberados para você. Escolha um para assistir."
        />
      </div>
    </div>
  );
}
