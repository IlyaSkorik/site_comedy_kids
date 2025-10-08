<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$role = $_POST['role'] ?? '';
$text = $_POST['text'] ?? '';



if (!$id || !$name || !$text) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: edit.php?id=' . $id);
    exit;
}

$testimonials = file_exists(ROOT_DIR . '/data/testimonials.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/testimonials.json'), true) 
    : [];

$uploadDir = ROOT_DIR . '/img/testimonials/';
$uploadUrl = '/img/testimonials/';
$newImage = null;

// Загрузка нового фото
if (!empty($_FILES['image_file']['name'])) {
    // Удаляем старое
    foreach ($testimonials as $t) {
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

    if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetPath)) {
        $newImage = $uploadUrl . $imageName;
    } else {
        $_SESSION['error'] = 'Ошибка загрузки нового фото';
        header('Location: edit.php?id=' . $id);
        exit;
    }
}


// Обновляем данные
foreach ($testimonials as &$t) {
    if ($t['id'] == $id) {
        $t['name'] = $name;
        $t['role'] = $role ;
        $t['text'] = $text;
        if ($newImage) {
            $t['image'] = $newImage;
        }
        break;
    }
}

file_put_contents(ROOT_DIR . '/data/testimonials.json', json_encode($testimonials, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Отзыв обновлён!';
header('Location: list.php');
exit;
?>