<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_POST['id'] ?? null;
$title = $_POST['title'] ?? '';
$subtitle = $_POST['subtitle'] ?? '';
$description = $_POST['description'] ?? '';
$features = array_filter(array_map('trim', explode("\n", $_POST['features'] ?? '')));
$btnText = $_POST['btnText'] ?? '';

if (!$id || !$title || !$subtitle || !$description || !$btnText) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: edit.php?id=' . $id);
    exit;
}

$programs = file_exists(ROOT_DIR . '/data/programs.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/programs.json'), true) 
    : [];

$uploadDir = ROOT_DIR . '/img/programs/';
$uploadUrl = '/img/programs/';
$newImage = null;

// Загрузка нового фото
if (!empty($_FILES['image_file']['name'])) {
    // Удаляем старое
    foreach ($programs as $p) {
        if ($p['id'] == $id && !empty($p['image'])) {
            $oldPath = ROOT_DIR . $p['image'];
            if (file_exists($oldPath)) unlink($oldPath);
        }
    }

    // Сохраняем новое
    $imageName = $id . '_' . time() . '.webp';
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
foreach ($programs as &$p) {
    if ($p['id'] == $id) {
        $p['title'] = $title;
        $p['subtitle'] = $subtitle;
        $p['description'] = $description;
        $p['features'] = $features;
        $p['btnText'] = $btnText;
        if ($newImage) $p['image'] = $newImage;
        break;
    }
}

file_put_contents(ROOT_DIR . '/data/programs.json', json_encode($programs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Программа обновлена!';
header('Location: list.php');
exit;
?>