<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? '';
$achievements = array_filter(array_map('trim', explode("\n", $_POST['achievements'] ?? '')));

if (!$id || !$name || !$role || !isset($_FILES['image'])) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: add.php');
    exit;
}

$uploadDir = ROOT_DIR . '/img/teacher/';
$uploadUrl = '/img/teacher/';
$imageName = $id . '_' . time() . '.webp';
$targetPath = $uploadDir . $imageName;

if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
    $_SESSION['error'] = 'Ошибка загрузки фото';
    header('Location: add.php');
    exit;
}

$teachers = file_exists(ROOT_DIR . '/data/teachers.json') ? json_decode(file_get_contents(ROOT_DIR . '/data/teachers.json'), true) : [];
$teachers[] = [
    'id' => $id,
    'name' => $name,
    'role' => $role,
    'achievements' => $achievements,
    'image' => $uploadUrl . $imageName,
    'alt' => $name,
    'quote' => $_POST['quote'] ?? ''  // 🔹 Добавлено
];

file_put_contents(ROOT_DIR . '/data/teachers.json', json_encode($teachers, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Преподаватель добавлен!';
header('Location: list.php');
exit;
?>