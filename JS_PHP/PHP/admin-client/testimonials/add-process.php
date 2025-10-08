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

if (!$id || !$name  || !$text || !isset($_FILES['image_file'])) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: add.php');
    exit;
}

// Папка для фото
$uploadDir = ROOT_DIR . '/img/testimonials/';
$uploadUrl = '/img/testimonials/';
$imageName = $id . '_' . time() . '.webp';
$targetPath = $uploadDir . $imageName;

if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

if (!convertToWebP($_FILES['image_file']['tmp_name'], $targetPath, 85)) {
    $_SESSION['error'] = 'Ошибка загрузки фото';
    header('Location: add.php');
    exit;
}

$testimonials = file_exists(ROOT_DIR . '/data/testimonials.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/testimonials.json'), true) 
    : [];

$testimonials[] = [
    'id' => $id,
    'name' => $name,
    'role' => $role,
    'text' => $text,
    'image' => $uploadUrl . $imageName
];

file_put_contents(ROOT_DIR . '/data/testimonials.json', json_encode($testimonials, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Отзыв добавлен!';
header('Location: list.php');
exit;

function convertToWebP($source, $destination, $quality = 80) {
    $info = getimagesize($source);
    if (!$info) return false;

    switch ($info['mime']) {
        case 'image/jpeg': $image = imagecreatefromjpeg($source); break;
        case 'image/png':
            $image = imagecreatefrompng($source);
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
            break;
        case 'image/webp': $image = imagecreatefromwebp($source); break;
        default: return false;
    }

    return imagewebp($image, $destination, $quality) && imagedestroy($image);
}
?>