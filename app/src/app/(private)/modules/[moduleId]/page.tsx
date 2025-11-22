import { notFound, redirect } from "next/navigation";
import { requireEmployee } from "@/auth/guards";
import { getModuleWithVideos } from "@/controllers/moduleController";
import { getModuleProgress } from "@/controllers/progressController";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "@/components/video/video-player";
import { VideoCard } from "@/components/video/video-card";
import { VideoCarousel } from "@/components/video/video-carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cuidSchema } from "@/models/id";

interface PageProps {
  params: Promise<{ moduleId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ModulePage({ params, searchParams }: PageProps) {
  const session = await requireEmployee();
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

  const hasAccess = trainingModule.accesses.some((access) => access.userId === session.user.id);
  if (!hasAccess) {
    redirect("/employee");
  }

  const moduleProgress = await getModuleProgress(session.user.id, trainingModule.id);
  const videoProgress = await prisma.videoProgress.findMany({
    where: { userId: session.user.id, video: { moduleId: trainingModule.id } },
  });
  const progressByVideo = Object.fromEntries(
    videoProgress.map((progress) => [progress.videoId, progress.status === "COMPLETED" ? 100 : Math.round(progress.progress * 100)]),
  );

  const resolvedSearch = searchParams ? await searchParams : undefined;
  const selectedVideoId = typeof resolvedSearch?.video === "string" ? resolvedSearch.video : undefined;
  const selectedVideo = trainingModule.videos.find((video) => video.id === selectedVideoId) ?? trainingModule.videos[0] ?? null;

  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_moduleId: {
        userId: session.user.id,
        moduleId: trainingModule.id,
      },
    },
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section with Player */}
      <div className="grid gap-6 lg:grid-cols-[1fr]">
        {selectedVideo ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/10">
              <VideoPlayer
                videoId={selectedVideo.id}
                url={selectedVideo.videoUrl}
                initialProgress={(progressByVideo[selectedVideo.id] ?? 0) / 100}
              />
            </div>
            <div className="px-2">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{selectedVideo.title}</h1>
              <p className="mt-2 text-slate-400 max-w-3xl">{selectedVideo.description}</p>
            </div>
          </div>
        ) : (
          <Card className="p-10 text-center">
            <p className="text-slate-500">Nenhum vídeo disponível neste módulo.</p>
          </Card>
        )}
      </div>

      {/* Module Info & Progress */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-bold mb-1">Módulo Atual</p>
          <h2 className="text-xl font-semibold text-white">{trainingModule.title}</h2>
          <p className="text-sm text-slate-500">{trainingModule.description}</p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progresso do Módulo</span>
            <span>{Math.round(moduleProgress.percentage)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: `${moduleProgress.percentage}%` }} />
          </div>
        </div>
      </div>

      {certificate && (
        <div className="mx-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          🎉 Parabéns! Você completou este módulo. <a className="underline font-bold hover:text-white" href={`/api/certificates/${certificate.id}`}>Baixe seu certificado aqui</a>.
        </div>
      )}

      {/* Video Carousel */}
      <div className="mt-8">
        <VideoCarousel title="Episódios">
          {trainingModule.videos.map((video, index) => (
            <VideoCard
              key={video.id}
              id={video.id}
              index={index}
              title={video.title}
              description={video.description}
              videoUrl={video.videoUrl}
              thumbnailUrl={video.thumbnailUrl}
              progress={progressByVideo[video.id] ?? 0}
              isCompleted={progressByVideo[video.id] === 100}
              isActive={selectedVideo?.id === video.id}
            />
          ))}
        </VideoCarousel>
      </div>
    </div>
  );
}
