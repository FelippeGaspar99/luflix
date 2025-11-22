<?php
$dbHost = '186.209.113.112';
$dbName = 'fgem9000_luflix';
$dbUser = 'fgem9000_luflix';
$dbPass = 'fgem9000_luflix';

try {
    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $exception) {
    die('Erro ao conectar ao banco: ' . $exception->getMessage());
}

$stmt = $pdo->query('SELECT * FROM video_config ORDER BY id ASC LIMIT 1');
$videoConfig = $stmt->fetch(PDO::FETCH_ASSOC);

function getYoutubeEmbedUrl(string $url): ?string
{
    if (preg_match('~youtu\.be/([a-zA-Z0-9_-]{11})~', $url, $matches)) {
        return "https://www.youtube.com/embed/{$matches[1]}?rel=0&modestbranding=1";
    }
    if (preg_match('~youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})~', $url, $matches)) {
        return "https://www.youtube.com/embed/{$matches[1]}?rel=0&modestbranding=1";
    }
    return null;
}

function getDrivePreviewUrl(string $url): ?string
{
    if (preg_match('~drive\.google\.com/file/d/([a-zA-Z0-9_-]+)/~', $url, $matches)) {
        return "https://drive.google.com/file/d/{$matches[1]}/preview";
    }
    if (preg_match('~drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)~', $url, $matches)) {
        return "https://drive.google.com/file/d/{$matches[1]}/preview";
    }
    return null;
}

$videoUrl = $videoConfig['video_url'] ?? '';
$posterUrl = $videoConfig['poster_url'] ?? '';
$youtubeEmbed = $videoUrl ? getYoutubeEmbedUrl($videoUrl) : null;
$drivePreview = (!$youtubeEmbed && $videoUrl) ? getDrivePreviewUrl($videoUrl) : null;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>LUFLIX – Player</title>
    <style>
        body { margin: 0; min-height: 100vh; font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; background: #020617; color: #e2e8f0; padding: 1.5rem; }
        .player-wrapper { width: 100%; max-width: 960px; }
        .card { background: rgba(15,23,42,0.9); border-radius: 24px; padding: 2rem; box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        .video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 18px; background: #000; }
        .video-container video,
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
        .empty { text-align: center; padding: 2rem; border-radius: 16px; border: 1px dashed rgba(148,163,184,0.7); background: rgba(15,23,42,0.6); }
    </style>
</head>
<body>
<div class="player-wrapper">
    <div class="card">
        <?php if ($videoConfig && !empty($videoUrl)): ?>
            <div class="video-container">
                <?php if ($youtubeEmbed): ?>
                    <iframe src="<?php echo htmlspecialchars($youtubeEmbed, ENT_QUOTES, 'UTF-8'); ?>" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                <?php elseif ($drivePreview): ?>
                    <iframe src="<?php echo htmlspecialchars($drivePreview, ENT_QUOTES, 'UTF-8'); ?>" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                <?php else: ?>
                    <video controls playsinline <?php if (!empty($posterUrl)) echo 'poster="' . htmlspecialchars($posterUrl, ENT_QUOTES, 'UTF-8') . '"'; ?>>
                        <source src="<?php echo htmlspecialchars($videoUrl, ENT_QUOTES, 'UTF-8'); ?>" type="video/mp4">
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                <?php endif; ?>
            </div>
        <?php else: ?>
            <div class="empty">Nenhum vídeo cadastrado ainda.</div>
        <?php endif; ?>
    </div>
</div>
</body>
</html>
