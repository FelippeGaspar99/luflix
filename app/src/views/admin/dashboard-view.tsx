import Link from "next/link";
import { Plus } from "lucide-react";
import { ModuleCard } from "@/components/modules/module-card";
import { SearchInput } from "@/components/search/search-input";

interface ModuleStats {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videosCount: number;
}

interface Props {
  modules: ModuleStats[];
}

export function AdminDashboardView({ modules }: Props) {
  return (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-2xl">
          <SearchInput
            placeholder="Buscar módulos ou vídeos..."
            className="h-12 bg-slate-900/60 border-slate-800 text-base"
          />
        </div>
        <Link
          href="/admin/modules/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          <Plus size={20} />
          Novo Módulo
        </Link>
      </div>

      {/* Modules Grid */}
      {modules.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
          <div className="text-center">
            <p className="text-lg text-slate-400">Nenhum módulo encontrado</p>
            <p className="text-sm text-slate-500 mt-2">
              Crie seu primeiro módulo ou refine sua busca
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              href={`/admin/modules/${module.id}`}
              title={module.title}
              description={module.description}
              coverUrl={module.coverUrl}
              videosCount={module.videosCount}
              showProgress={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
