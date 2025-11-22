'use client';

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveVideoUrl } from "@/videos/helpers";
import { DrivePlayer } from "./drive-player";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface Props {
  videoId: string;
  url: string;
  initialProgress?: number;
  trackProgress?: boolean;
  playSignal?: string | null;
  onEnded?: () => void;
}

export function VideoPlayer({ videoId, url, initialProgress = 0, trackProgress = true, playSignal, onEnded }: Props) {
  const lastSentProgress = useRef(initialProgress);
  const { provider, playableUrl, embedUrl } = useMemo(() => resolveVideoUrl(url), [url]);
  const shouldTrack = trackProgress && provider !== "GOOGLE_DRIVE";
  const shouldPlay = Boolean(playSignal && playSignal.startsWith(`${videoId}-`));
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const sendProgress = async (progress: number) => {
    if (!shouldTrack) return;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, progress }),
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProgress = (state: { played: number }) => {
    if (!shouldTrack) return;
    const progress = Number(state.played.toFixed(2));
    if (progress >= 0.98 || Math.abs(progress - lastSentProgress.current) >= 0.1) {
      lastSentProgress.current = progress;
      void sendProgress(progress);
    }
  };

  const [isPlaying, setIsPlaying] = useState(shouldPlay);

  useEffect(() => {
    setIsPlaying(shouldPlay);
  }, [shouldPlay]);

  const renderLocalVideo = () => (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl md:rounded-3xl">
      <video
        ref={localVideoRef}
        src={playableUrl}
        controls
        playsInline
        className="h-full w-full"
        controlsList="nodownload"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          const element = event.currentTarget;
          if (!element.duration) return;
          const progress = element.currentTime / element.duration;
          handleProgress({ played: progress });
        }}
        onEnded={() => {
          handleProgress({ played: 1 });
          onEnded?.();
          setIsPlaying(false);
        }}
      />
    </div>
  );

  useEffect(() => {
    // Agora GOOGLE_DRIVE também usa o player nativo (via proxy), então deve ser incluído aqui
    if (provider !== "LOCAL_FILE" && provider !== "GOOGLE_DRIVE") return;

    const element = localVideoRef.current;
    if (!element) return;

    if (isPlaying) {
      const playPromise = element.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch((e) => {
          // Ignora erro de interrupção se o componente desmontou ou mídia mudou
          if (e.name !== 'AbortError') {
            console.warn("Autoplay prevented by browser:", e);
          }
          setIsPlaying(false);
        });
      }
    } else {
      element.pause();
    }
  }, [isPlaying, provider]);

  const renderYouTubeEmbed = () => {
    if (!embedUrl) return null;

    // Add autoplay and other params
    const embedUrlObj = new URL(embedUrl);
    if (isPlaying) {
      embedUrlObj.searchParams.set("autoplay", "1");
    }
    embedUrlObj.searchParams.set("rel", "0");
    embedUrlObj.searchParams.set("modestbranding", "1");
    embedUrlObj.searchParams.set("playsinline", "1");

    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl md:rounded-3xl">
        <iframe
          src={embedUrlObj.toString()}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
          title="YouTube video"
        />
      </div>
    );
  };

  if (provider === "LOCAL_FILE") {
    return renderLocalVideo();
  }

  if (provider === "GOOGLE_DRIVE") {
    return <DrivePlayer url={url} />;
  }

  if (provider === "YOUTUBE") {
    return renderYouTubeEmbed();
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl md:rounded-3xl">
      <ReactPlayer
        url={playableUrl}
        controls
        width="100%"
        height="100%"
        playsinline
        playing={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onProgress={(state: any) => handleProgress(state)}
        onEnded={() => {
          handleProgress({ played: 1 });
          onEnded?.();
          setIsPlaying(false);
        }}
        progressInterval={2000}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
            forceVideo: true,
          },
        }}
      />
    </div>
  );
}
