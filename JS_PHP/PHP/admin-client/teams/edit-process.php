<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

// После file_put_contents — добавь заголовок, чтобы браузер не кэшировал
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$age = $_POST['age'] ?? '';
$achievements = array_filter(array_map('trim', explode("\n", $_POST['achievements'] ?? '')));

if (!$id || !$name || !$age) {
    $_SESSION['error'] = 'Заполните все обязательые поля';
    header('Location: edit.php?id=' . $id);
    exit;
}

$teams = file_exists(ROOT_DIR . '/data/teams.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/teams.json'), true) 
    : [];

$uploadDir = ROOT_DIR . '/img/team/';
$uploadUrl = '/img/team/';
$newImage = null;

// Загрузка нового фото
if (!empty($_FILES['image_file']['name'])) {
    // Удаляем старое
    foreach ($teams as $t) {
        if ($t['id'] == $id && !empty($t['image'])) {
            $oldPath = ROOT_DIR . $t['image'];
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }
    }

    // Сохраняем новое
    $imageName = 'team_' . $id . '_' . time() . '.webp';
    $targetPath = $uploadDir . $imageName;
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetPath)) {
        $newImage = $uploadUrl . $imageName;
    } else {
        $_SESSION['error'] = 'Ошибка загрузки нового фото';
        header('Location: edit.php?id=' . $id);
        exit;
    }
}

// Обновляем данные
foreach ($teams as &$t) {
    if ($t['id'] == $id) {
        $t['title'] = $name;
        $t['name'] = $name;
        $t['age'] = $age;
        $t['achievements'] = $achievements;
        if ($newImage) {
            $t['image'] = $newImage;
        }
        break;
    }
}

file_put_contents(ROOT_DIR . '/data/teams.json', json_encode($teams, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Команда обновлена!';
header('Location: ../index.php');
exit;
?>