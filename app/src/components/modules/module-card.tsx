import Image from "next/image";
import Link from "next/link";
import { Play, Film } from "lucide-react";
import { cn } from "@/lib/cn";
import { Progress } from "@/components/ui/progress";

interface ModuleCardProps {
  href: string;
  title: string;
  description: string;
  coverUrl: string;
  videosCount: number;
  progress?: number;
  className?: string;
}

export function ModuleCard({
  href,
  title,
  description,
  coverUrl,
  videosCount,
  progress,
  className,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-slate-900/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20",
        className,
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

        {/* Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
            <Play className="ml-1 h-6 w-6 fill-rose-600 text-rose-600" />
          </div>
        </div>

        {/* Video Count Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-sm">
          <Film className="h-3.5 w-3.5 text-slate-300" />
          <span className="text-xs font-medium text-slate-200">{videosCount}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-rose-400">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
          {description}
        </p>

        {progress !== undefined && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Progresso</span>
              <span className={`font-semibold ${progress === 100 ? "text-emerald-400" : "text-slate-400"}`}>
                {progress}%
              </span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </div>
    </Link>
  );
}
