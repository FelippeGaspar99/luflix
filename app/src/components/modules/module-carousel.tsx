"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ModuleCard } from "@/components/modules/module-card";

type ModuleItem = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videosCount: number;
  progress?: number;
  createdAt?: string;
};

interface ModuleCarouselProps {
  modules: ModuleItem[];
  baseHref: string;
  heading?: string;
  subheading?: string;
}

export function ModuleCarousel({ modules, baseHref, heading, subheading }: ModuleCarouselProps) {
  const [sortBy, setSortBy] = useState<"recent" | "title" | "progress">("recent");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasProgress = modules.some((module) => typeof module.progress === "number");

  const sortedModules = useMemo(() => {
    const list = [...modules];
    return list.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "progress") {
        return (b.progress ?? 0) - (a.progress ?? 0);
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [modules, sortBy]);

  const scroll = (direction: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.85;
    node.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {heading ? <h2 className="text-2xl font-semibold text-white">{heading}</h2> : null}
          {subheading ? <p className="text-sm text-slate-400">{subheading}</p> : null}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="text-slate-500">Ordenar</span>
          <select
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100 shadow-inner focus:border-rose-500 focus:outline-none"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
          >
            <option value="recent">Mais recentes</option>
            <option value="title">A-Z</option>
            {hasProgress ? <option value="progress">Maior progresso</option> : null}
          </select>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-800 bg-slate-900/90 p-2 text-slate-100 shadow-xl transition hover:border-slate-600"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-hidden px-10">
          {sortedModules.map((module) => (
            <div key={module.id} className="w-[260px] shrink-0">
              <ModuleCard
                href={`${baseHref}/${module.id}`}
                title={module.title}
                description={module.description}
                coverUrl={module.coverUrl}
                videosCount={module.videosCount}
                progress={module.progress}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-800 bg-slate-900/90 p-2 text-slate-100 shadow-xl transition hover:border-slate-600"
          aria-label="Próximo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
