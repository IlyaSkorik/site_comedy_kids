<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    $_SESSION['error'] = 'Преподаватель не найден';
    header('Location: list.php');
    exit;
}

$teachers = file_exists(ROOT_DIR . '/data/teachers.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/teachers.json'), true) 
    : [];

$updatedTeachers = [];
$deletedImage = null;

foreach ($teachers as $t) {
    if ($t['id'] == $id) {
        $deletedImage = ROOT_DIR . $t['image'];
    } else {
        $updatedTeachers[] = $t;
    }
}

file_put_contents(ROOT_DIR . '/data/teachers.json', json_encode($updatedTeachers, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// Удаляем фото
if ($deletedImage && file_exists($deletedImage)) {
    unlink($deletedImage);
}

$_SESSION['success'] = 'Преподаватель удалён!';
header('Location: list.php');
exit;
?>