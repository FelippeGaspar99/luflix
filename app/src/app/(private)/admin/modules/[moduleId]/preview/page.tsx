import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/auth/guards';
import { cuidSchema } from '@/models/id';
import { getModuleWithVideos } from '@/controllers/moduleController';
import { Card } from '@/components/ui/card';
import { ModuleCourseViewer } from '@/components/modules/module-course-viewer';

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export const metadata = {
  title: 'Admin | Preview do curso',
};

export default async function ModuleCoursePreviewPage({ params }: PageProps) {
  await requireAdmin();
  const resolvedParams = await params;
  const parsedId = cuidSchema.safeParse(resolvedParams?.moduleId);
  if (!parsedId.success) {
    notFound();
  }

  const moduleData = await getModuleWithVideos(parsedId.data);
  if (!moduleData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Preview do curso</p>
          <h1 className="text-3xl font-bold text-white">{moduleData.title}</h1>
          <p className="text-slate-400">{moduleData.description}</p>
        </div>
        <Link
          href={`/admin/modules/${moduleData.id}`}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-600"
        >
          ← Voltar para edição
        </Link>
      </Card>

      <Card>
        <ModuleCourseViewer videos={moduleData.videos} />
      </Card>
    </div>
  );
}
