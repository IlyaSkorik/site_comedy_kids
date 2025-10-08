<?php
include '../config.php';
checkAuth();

$logFile = ROOT_DIR . '/error.log';
$logContent = file_exists($logFile) ? file_get_contents($logFile) : 'Логи пусты';
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Логи — Поддержка</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="admin-container">
        <aside class="sidebar">...</aside>
        <main class="main-content">
            <h1>📋 Логи сайта</h1>
            <pre style="background: #1e0c2a; color: #0f0; padding: 20px; border-radius: 10px; max-height: 600px; overflow: auto;">
<?= htmlspecialchars($logContent) ?>
            </pre>
            <a href="dashboard.php" class="btn btn-secondary">Назад</a>
        </main>
    </div>
</body>
</html>