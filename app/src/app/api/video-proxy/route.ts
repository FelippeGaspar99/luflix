import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return new NextResponse("Video ID is required", { status: 400 });
  }

  try {
    const driveUrl =
      "https://drive.google.com/uc?export=download&id=" + videoId;

    let response = await fetch(driveUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("text/html")) {
      console.log(
        "Proxy: Recebido HTML em vez de vídeo. Tentando contornar aviso de vírus..."
      );

      const text = await response.text();
      const confirmMatch = text.match(/href="(\/uc\?export=download[^"]+)"/);

      if (confirmMatch) {
        // usa concatenação de string em vez de template string
        const confirmUrl =
          "https://drive.google.com" +
          confirmMatch[1].replace(/&amp;/g, "&");

        console.log(
          "Proxy: Link de confirmação encontrado. Redirecionando..."
        );

        response = await fetch(confirmUrl, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });
      } else {
        console.error(
          "Proxy: Não foi possível encontrar link de confirmação de vírus."
        );
      }
    }

    if (!response.ok) {
      console.error(
        `Google Drive returned ${response.status} ${response.statusText}`
      );
      return new NextResponse(
        `Failed to fetch video from Google Drive: ${response.statusText}`,
        { status: response.status }
      );
    }

    const headers = new Headers();
    const finalContentType = response.headers.get("Content-Type");
    const contentLength = response.headers.get("Content-Length");

    if (finalContentType) headers.set("Content-Type", finalContentType);
    if (contentLength) headers.set("Content-Length", contentLength);

    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error proxying video:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
