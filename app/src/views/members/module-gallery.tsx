"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ModuleCarousel } from "@/components/modules/module-carousel";

type ModuleCardData = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videosCount: number;
  createdAt?: string;
  progress?: number;
  videos?: { title: string }[];
};

interface ModuleGalleryProps {
  modules: ModuleCardData[];
  baseHref: string;
  heading?: string;
  subheading?: string;
}

export function ModuleGallery({ modules, baseHref, heading, subheading }: ModuleGalleryProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return modules;
    return modules.filter((module) => {
      const inModule =
        module.title.toLowerCase().includes(normalizedQuery) ||
        module.description.toLowerCase().includes(normalizedQuery);
      const inVideos = module.videos?.some((video) =>
        video.title.toLowerCase().includes(normalizedQuery),
      );
      return inModule || inVideos;
    });
  }, [modules, normalizedQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-4xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar módulos ou vídeos..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 pl-14 pr-4 py-4 text-base text-slate-100 placeholder:text-slate-500 shadow-inner focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 text-center text-slate-400">
          Nenhum módulo encontrado para sua busca.
        </div>
      ) : (
        <ModuleCarousel
          modules={filtered}
          baseHref={baseHref}
          heading={heading}
          subheading={subheading}
        />
      )}
    </div>
  );
}
