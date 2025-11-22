import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/auth/session";
import { cuidSchema } from "@/models/id";
import { getModuleWithVideos } from "@/controllers/moduleController";
import { prisma } from "@/lib/prisma";
import { getModuleProgress } from "@/controllers/progressController";
import { Card } from "@/components/ui/card";
import { ModuleCourseViewer } from "@/components/modules/module-course-viewer";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function MembersModulePage({ params }: PageProps) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  const resolved = await params;
  const parsed = cuidSchema.safeParse(resolved?.moduleId);
  if (!parsed.success) {
    notFound();
  }

  const course = await getModuleWithVideos(parsed.data);
  if (!course || !course.isMembersVisible) {
    notFound();
  }

  const [moduleSummary, videoProgress] = await Promise.all([
    getModuleProgress(session.user.id, course.id),
    prisma.videoProgress.findMany({
      where: { userId: session.user.id, video: { moduleId: course.id } },
    }),
  ]);

  const progressMap = Object.fromEntries(
    videoProgress.map((progress) => [progress.videoId, progress.status === "COMPLETED" ? 100 : Math.round(progress.progress * 100)]),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <Card className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Área de membros</p>
              <h1 className="text-3xl font-semibold text-white">{course.title}</h1>
              <p className="text-slate-400">{course.description}</p>
              <p className="text-sm text-slate-500">
                {moduleSummary.totalVideos} {moduleSummary.totalVideos === 1 ? 'vídeo' : 'vídeos'}
              </p>
            </div>
            <Link
              href="/members"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600"
            >
              ← Voltar para lista de cursos
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <ModuleCourseViewer videos={course.videos} progress={progressMap} />
        </Card>
      </div>
    </div>
  );
}
