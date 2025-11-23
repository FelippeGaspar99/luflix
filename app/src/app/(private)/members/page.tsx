import { getSession } from "@/auth/session";
import { getModulesForMembers } from "@/controllers/moduleController";
import { ModuleGallery } from "@/views/members/module-gallery";

export default async function MembersPage() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  const modules = await getModulesForMembers();

  if (modules.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-slate-900 px-6 text-center text-slate-300">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 px-10 py-12 text-lg">
          Nenhum módulo liberado ainda.
        </div>
      </div>
    );
  }

  const moduleCards = modules.map((module: any) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    coverUrl: module.coverUrl,
    videosCount: module.videos?.length ?? 0,
    createdAt: module.createdAt?.toISOString?.() ?? null,
    videos: module.videos?.map((video: any) => ({ title: video.title })) ?? [],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ModuleGallery
          modules={moduleCards}
          baseHref="/members/modules"
          heading="Área de membros"
          subheading="Escolha um módulo para assistir; cada curso abre com player e playlist completos."
          showProgress={false}
        />
      </div>
    </div>
  );
}
