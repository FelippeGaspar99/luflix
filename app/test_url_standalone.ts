const LOCAL_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".ogg"];

function resolveVideoUrl(url: string) {
    const trimmed = url.trim();

    const isRelative = trimmed.startsWith("/");
    const hasLocalExtension = LOCAL_EXTENSIONS.some((ext) => trimmed.toLowerCase().includes(ext));

    if (isRelative || hasLocalExtension) {
        return { provider: "LOCAL_FILE", playableUrl: trimmed };
    }

    try {
        const parsed = new URL(trimmed);
        const hostname = parsed.hostname;

        if (hostname.includes("youtu.be")) {
            const videoId = parsed.pathname.replace("/", "");
            if (videoId) {
                return {
                    provider: "YOUTUBE",
                    playableUrl: `https://www.youtube.com/watch?v=${videoId}`,
                };
            }
        }

        if (hostname.includes("youtube.com")) {
            if (parsed.pathname.startsWith("/shorts/")) {
                const videoId = parsed.pathname.split("/shorts/")[1];
                if (videoId) {
                    return {
                        provider: "YOUTUBE",
                        playableUrl: `https://www.youtube.com/watch?v=${videoId}`,
                    };
                }
            }

            const videoId = parsed.searchParams.get("v");
            if (videoId) {
                return {
                    provider: "YOUTUBE",
                    playableUrl: `https://www.youtube.com/watch?v=${videoId}`,
                };
            }
        }

        if (hostname.includes("drive.google")) {
            const idFromPath = parsed.pathname.split("/d/")[1]?.split("/")[0];
            const idFromQuery = parsed.searchParams.get("id");
            const fileId = idFromPath ?? idFromQuery;

            if (fileId) {
                const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                return {
                    provider: "GOOGLE_DRIVE",
                    playableUrl: embedUrl,
                    embedUrl,
                };
            }
        }

        return { provider: "EXTERNAL", playableUrl: trimmed };
    } catch {
        return { provider: "EXTERNAL", playableUrl: trimmed };
    }
}

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
console.log("URL:", url);
console.log("Result:", resolveVideoUrl(url));

const url2 = "https://drive.google.com/file/d/12345/preview";
console.log("Drive Result:", resolveVideoUrl(url2));
