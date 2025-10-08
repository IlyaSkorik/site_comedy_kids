<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    $_SESSION['error'] = 'Отзыв не найден';
    header('Location: list.php');
    exit;
}

$testimonials = file_exists(ROOT_DIR . '/data/testimonials.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/testimonials.json'), true) 
    : [];

$updatedTestimonials = [];
$deletedImage = null;

foreach ($testimonials as $t) {
    if ($t['id'] == $id) {
        $deletedImage = ROOT_DIR . $t['image'];
    } else {
        $updatedTestimonials[] = $t;
    }
}

file_put_contents(ROOT_DIR . '/data/testimonials.json', json_encode($updatedTestimonials, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// Удаляем фото
if ($deletedImage && file_exists($deletedImage)) {
    unlink($deletedImage);
}

$_SESSION['success'] = 'Отзыв удалён!';
header('Location: list.php');
exit;
?>