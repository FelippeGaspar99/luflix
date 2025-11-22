import { getVideoConfig } from '@/lib/video-config';
import { getYoutubeEmbedUrl, getDrivePreviewUrl } from '@/lib/video-utils';

export const metadata = {
  title: 'LUFLIX | Vídeo institucional',
};

export default async function VideoPage() {
  const config = await getVideoConfig();

  if (!config || !config.videoUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-slate-900 px-6 text-center text-slate-300">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 px-10 py-12 text-lg">
          Nenhum vídeo cadastrado ainda.
        </div>
      </div>
    );
  }

  const youtubeEmbed = getYoutubeEmbedUrl(config.videoUrl);
  const drivePreview = youtubeEmbed ? null : getDrivePreviewUrl(config.videoUrl);
  const poster = config.posterUrl ?? undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#020617] to-[#0f172a] px-4 py-10">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl shadow-black/40">
        <div className="mb-6 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Player</p>
          <h1 className="text-3xl font-semibold text-white">Vídeo institucional</h1>
        </div>
        <div
          className="relative w-full overflow-hidden rounded-3xl bg-black"
          style={{ paddingBottom: '56.25%' }}
        >
          {youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : drivePreview ? (
            <iframe
              src={drivePreview}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              controls
              playsInline
              className="absolute inset-0 h-full w-full"
              poster={poster}
            >
              <source src={config.videoUrl} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
