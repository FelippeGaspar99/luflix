import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ModuleCard } from "@/components/modules/module-card";
import { SearchInput } from "@/components/search/search-input";
import { VideoCarousel } from "@/components/video/video-carousel";
import { VideoCard } from "@/components/video/video-card";

interface ModuleWithProgress {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videosCount: number;
  progress: number;
}

interface CertificateItem {
  id: string;
  moduleTitle: string;
  issuedAt: string;
}

interface RecentVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  moduleId: string;
  moduleTitle: string;
  progress: number;
  isCompleted: boolean;
}

interface Props {
  modules: ModuleWithProgress[];
  certificates: CertificateItem[];
  recentVideos: RecentVideo[];
}

export function EmployeeDashboardView({ modules, certificates, recentVideos }: Props) {
  const nextModule = modules.find((module) => module.progress < 100) ?? modules[0];

  return (
    <div className="space-y-10">
      {nextModule && (
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 to-fuchsia-700 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Continuar assistindo</p>
          <h1 className="mt-2 text-4xl font-bold text-white">{nextModule.title}</h1>
          <p className="mt-3 max-w-2xl text-white/80">{nextModule.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span>{nextModule.videosCount} vídeos</span>
            <span>·</span>
            <span>{nextModule.progress}% concluído</span>
          </div>
          <Link
            href={`/modules/${nextModule.id}`}
            className="mt-6 inline-flex rounded-full bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur"
          >
            Continuar módulo
          </Link>
        </section>
      )}

      {recentVideos.length > 0 && (
        <section>
          <VideoCarousel title="Assistidos Recentemente">
            {recentVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                id={video.id}
                index={index}
                title={video.title}
                description={`Módulo: ${video.moduleTitle}`}
                videoUrl={video.videoUrl}
                thumbnailUrl={video.thumbnailUrl}
                progress={video.progress}
                isCompleted={video.isCompleted}
              />
            ))}
          </VideoCarousel>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Seus módulos</h2>
            <p className="text-sm text-slate-500">Layout inspirado na Netflix com cards responsivos.</p>
          </div>
          <div className="w-full max-w-sm">
            <SearchInput placeholder="Buscar por título ou descrição" />
          </div>
        </div>
        {modules.length === 0 ? (
          <Card>
            <p className="text-slate-500">Nenhum módulo liberado. Aguarde a liberação pelo administrador.</p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map((module) => (
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
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Certificados</h2>
            <p className="text-sm text-slate-500">Baixe comprovantes com a identidade visual da empresa.</p>
          </div>
        </div>
        {certificates.length === 0 ? (
          <Card>
            <p className="text-slate-500">Conclua um módulo para desbloquear certificados.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{certificate.moduleTitle}</p>
                  <p className="text-sm text-slate-500">Emitido em {certificate.issuedAt}</p>
                </div>
                <Link
                  href={`/api/certificates/${certificate.id}`}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                >
                  Download
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
