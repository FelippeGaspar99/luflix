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
        <div className="relative w-full pb-[56.25%] h-0 rounded-3xl overflow-hidden bg-black shadow-2xl">
            <iframe
                key={embedUrl} // evita remount desnecessário
                src={embedUrl}
                allow="fullscreen"
                className="absolute inset-0 w-full h-full border-0"
            ></iframe>
        </div>
    );
}
