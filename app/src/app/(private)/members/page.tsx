import { getSession } from "@/auth/session";
import { getModulesForMembers } from "@/controllers/moduleController";
import { ModuleCard } from "@/components/modules/module-card";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Área de membros</p>
          <h1 className="text-3xl font-semibold text-white">Cursos disponíveis</h1>
          <p className="text-slate-400">Escolha um módulo para assistir; cada curso abre com player e playlist completos.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module: any) => (
            <ModuleCard
              key={module.id}
              href={`/members/modules/${module.id}`}
              title={module.title}
              description={module.description}
              coverUrl={module.coverUrl}
              videosCount={module.videos?.length ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
