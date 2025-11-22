"use client";
import { useEffect, useState } from "react";

interface DrivePlayerProps {
    url: string;
}

export function DrivePlayer({ url }: DrivePlayerProps) {
    const [embedUrl, setEmbedUrl] = useState("");

    useEffect(() => {
        if (!url) return;

        let fileId = null;

        if (url.includes("/file/d/")) {
            fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        } else if (url.includes("open?id=")) {
            fileId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
        }

        if (fileId) {
            setEmbedUrl(
                `https://drive.google.com/file/d/${fileId}/preview?usp=sharing`
            );
        }
    }, [url]);

    if (!embedUrl) return null;

    return (
        <div className="relative h-0 w-full overflow-hidden rounded-xl bg-black pb-[56.25%] shadow-2xl md:rounded-3xl">
            <iframe
                key={embedUrl} // evita remount desnecessário
                src={embedUrl}
                allow="fullscreen"
                className="absolute inset-0 w-full h-full border-0"
            ></iframe>
        </div>
    );
}
