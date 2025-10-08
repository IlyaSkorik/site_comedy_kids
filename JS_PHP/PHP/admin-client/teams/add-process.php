<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

// Получаем данные
$id = $_POST['id'] ?? null;
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$achievements = array_filter(array_map('trim', explode("\n", $_POST['achievements'] ?? '')));

// Проверка
if (!$id || !$title || !$description || !isset($_FILES['image'])) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: add.php');
    exit;
}

// Загрузка фото
$uploadDir = ROOT_DIR . '/img/team/';
$uploadUrl = '/img/team/';
$imageName = $id . '_' . time() . '.jpg';
$targetPath = $uploadDir . $imageName;

if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
    $_SESSION['error'] = 'Ошибка загрузки фото';
    header('Location: add.php');
    exit;
}

// Сохраняем в JSON
$teams = file_exists(TEAMS_FILE) ? json_decode(file_get_contents(TEAMS_FILE), true) : [];
$teams[] = [
    'id' => $id,
    'title' => $title,
    'description' => $description,
    'achievements' => $achievements,
    'image' => $uploadUrl . $imageName,
    'alt' => $title
];

file_put_contents(TEAMS_FILE, json_encode($teams, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// Перенаправляем
$_SESSION['success'] = 'Команда добавлена!';
header('Location: ../index.php');
exit;
?>