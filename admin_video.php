<?php
// Credenciais do MySQL (ajustadas para o servidor remoto)
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
$currentConfig = $stmt->fetch(PDO::FETCH_ASSOC);

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $videoUrl = trim($_POST['video_url'] ?? '');
    $posterUrl = trim($_POST['poster_url'] ?? '');

    if ($videoUrl === '') {
        $message = 'Informe a URL do vídeo.';
    } else {
        if ($currentConfig) {
            $update = $pdo->prepare('UPDATE video_config SET video_url = ?, poster_url = ? WHERE id = ?');
            $update->execute([
                $videoUrl,
                $posterUrl !== '' ? $posterUrl : null,
                $currentConfig['id'],
            ]);
            $message = 'Vídeo atualizado com sucesso!';
        } else {
            $insert = $pdo->prepare('INSERT INTO video_config (video_url, poster_url) VALUES (?, ?)');
            $insert->execute([
                $videoUrl,
                $posterUrl !== '' ? $posterUrl : null,
            ]);
            $message = 'Vídeo cadastrado com sucesso!';
            $currentConfig = [
                'id' => $pdo->lastInsertId(),
                'video_url' => $videoUrl,
                'poster_url' => $posterUrl !== '' ? $posterUrl : null,
            ];
        }
    }
}

$videoValue = htmlspecialchars($currentConfig['video_url'] ?? '', ENT_QUOTES, 'UTF-8');
$posterValue = htmlspecialchars($currentConfig['poster_url'] ?? '', ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Admin - LUFLIX</title>
    <style>
        body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; font-family: Arial, sans-serif; }
        .panel { width: 100%; max-width: 640px; background: #111827; color: #e2e8f0; padding: 2rem; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.45); }
        h1 { margin-top: 0; margin-bottom: 1.5rem; font-size: 1.8rem; }
        label { display: block; font-size: .85rem; text-transform: uppercase; letter-spacing: .12em; margin-bottom: .4rem; color: #94a3b8; }
        input[type="text"] { width: 100%; padding: .85rem 1rem; border-radius: 12px; border: 1px solid #1f2937; background: #0b1120; color: #f8fafc; margin-bottom: 1.35rem; }
        button { border: none; background: linear-gradient(90deg, #38bdf8, #6366f1); color: #0f172a; font-weight: bold; padding: .9rem 1.8rem; border-radius: 999px; cursor: pointer; }
        button:hover { opacity: 0.9; }
        .message { padding: .85rem 1rem; border-radius: 12px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.35); margin-bottom: 1rem; }
    </style>
</head>
<body>
<div class="panel">
    <h1>Cadastro de Vídeo Global</h1>

    <?php if ($message !== ''): ?>
        <div class="message"><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form method="post">
        <label for="video_url">URL do Vídeo (YouTube, Google Drive ou MP4 direto)</label>
        <input type="text" id="video_url" name="video_url" value="<?php echo $videoValue; ?>" required>

        <label for="poster_url">URL da Capa (opcional)</label>
        <input type="text" id="poster_url" name="poster_url" value="<?php echo $posterValue; ?>">

        <button type="submit">Salvar</button>
    </form>
</div>
</body>
</html>
