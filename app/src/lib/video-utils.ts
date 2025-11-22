export function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/i);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}

export function getDrivePreviewUrl(url: string): string | null {
  const filePattern = /drive\.google\.com\/file\/d\/([\w-]+)/i;
  const queryPattern = /drive\.google\.com\/(?:open|uc)\?id=([\w-]+)/i;
  const match = url.match(filePattern) ?? url.match(queryPattern);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
}
