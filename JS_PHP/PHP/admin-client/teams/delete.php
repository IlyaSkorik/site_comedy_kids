<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    $_SESSION['error'] = 'Команда не найдена';
    header('Location: ../index.php');
    exit;
}

$teams = file_exists(TEAMS_FILE) ? json_decode(file_get_contents(TEAMS_FILE), true) : [];
$updatedTeams = [];
$deletedImage = null;

foreach ($teams as $t) {
    if ($t['id'] == $id) {
        $deletedImage = ROOT_DIR . $t['image'];
    } else {
        $updatedTeams[] = $t;
    }
}

file_put_contents(TEAMS_FILE, json_encode($updatedTeams, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// Удаляем фото, если существует
if ($deletedImage && file_exists($deletedImage)) {
    unlink($deletedImage);
}

$_SESSION['success'] = 'Команда удалена!';
header('Location: ../index.php');
exit;
?>