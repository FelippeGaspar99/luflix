<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player Google Drive (PHP)</title>
    <style>
        /* Container responsivo para manter proporção 16:9 */
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
            height: 0;
            overflow: hidden;
            border-radius: 12px;
            background-color: #000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .video-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }

        body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #0f172a;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }

        .container {
            width: 100%;
            max-width: 800px;
            padding: 20px;
        }
    </style>
</head>
<body>

<div class="container">
    <?php
    /**
     * Renderiza um player de vídeo do Google Drive
     * 
     * @param string $fileId O ID do arquivo no Google Drive
     */
    function renderGoogleDrivePlayer($fileId) {
        // Sanitiza o ID para evitar XSS
        $safeId = htmlspecialchars($fileId, ENT_QUOTES, 'UTF-8');
        
        // Formato solicitado: https://drive.google.com/file/d/ID/preview
        $embedUrl = "https://drive.google.com/file/d/{$safeId}/preview";
        
        echo '
        <div class="video-wrapper">
            <iframe 
                src="' . $embedUrl . '" 
                allow="autoplay; encrypted-media; fullscreen" 
                allowfullscreen>
            </iframe>
        </div>';
    }

    // Exemplo de uso:
    // Pega o ID da URL (ex: ?id=SEU_ID) ou usa um padrão
    $videoId = isset($_GET['id']) ? $_GET['id'] : '1D_hF3ueyW-YA9v25BU2d_NIyDk5zfYBY';

    if ($videoId) {
        renderGoogleDrivePlayer($videoId);
    } else {
        echo '<p>Nenhum ID de vídeo fornecido.</p>';
    }
    ?>
</div>

</body>
</html>
