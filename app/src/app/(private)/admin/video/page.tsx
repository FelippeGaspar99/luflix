import { requireAdmin } from '@/auth/guards';
import { Card } from '@/components/ui/card';
import { VideoConfigForm } from '@/components/forms/video-config-form';
import { getVideoConfig } from '@/lib/video-config';

export const metadata = {
  title: 'Admin | Vídeo institucional',
};

export default async function AdminVideoPage() {
  await requireAdmin();
  const config = await getVideoConfig();

  return (
    <div className="space-y-8">
      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Vídeo institucional</p>
          <h1 className="text-3xl font-semibold text-white">Configuração do player</h1>
          <p className="text-sm text-slate-400">
            Cadastre um link do YouTube, Google Drive ou arquivo MP4 para exibir no player interno disponível em /video.
          </p>
        </div>
        <VideoConfigForm
          initialValues={{
            videoUrl: config?.videoUrl ?? '',
            posterUrl: config?.posterUrl ?? '',
          }}
          redirectPath="/admin/video"
        />
      </Card>
    </div>
  );
}
