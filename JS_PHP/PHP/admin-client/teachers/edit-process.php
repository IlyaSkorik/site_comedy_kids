<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? '';
$experience = $_POST['experience'] ?? '';
$achievements = array_filter(array_map('trim', explode("\n", $_POST['achievements'] ?? '')));
$quote = $_POST['quote'] ?? '';

if (!$id || !$name || !$role ) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: edit.php?id=' . $id);
    exit;
}

$teachers = file_exists(ROOT_DIR . '/data/teachers.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/teachers.json'), true) 
    : [];

$uploadDir = ROOT_DIR . '/img/teacher/';
$uploadUrl = '/img/teacher/';
$newImage = null;

// Загрузка нового фото
if (!empty($_FILES['image']['name'])) {
    // Удаляем старое фото
    foreach ($teachers as $t) {
        if ($t['id'] == $id && !empty($t['image'])) {
            $oldPath = ROOT_DIR . $t['image'];
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }
    }

    // Сохраняем новое
    $imageName = $id . '_' . time() . '.webp';
    $targetPath = $uploadDir . $imageName;
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        $newImage = $uploadUrl . $imageName;
    } else {
        $_SESSION['error'] = 'Ошибка загрузки нового фото';
        header('Location: edit.php?id=' . $id);
        exit;
    }
}

// Обновляем данные
foreach ($teachers as &$t) {
    if ($t['id'] == $id) {
        $t['name'] = $name;
        $t['role'] = $role;
        $t['experience'] = $experience;
        $t['achievements'] = $achievements;
        $t['quote'] = $quote;
        if ($newImage) {
            $t['image'] = $newImage;
        }
        break;
    }
}

file_put_contents(ROOT_DIR . '/data/teachers.json', json_encode($teachers, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Преподаватель успешно обновлён!';
header('Location: list.php');
exit;
?>