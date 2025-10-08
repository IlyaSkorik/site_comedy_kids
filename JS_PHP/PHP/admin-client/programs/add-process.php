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

if (!$id || !$title || !$subtitle || !$description || !$btnText || !isset($_FILES['image_file'])) {
    $_SESSION['error'] = 'Заполните все обязательные поля';
    header('Location: add.php');
    exit;
}

// Папка для фото
$uploadDir = ROOT_DIR . '/img/programs/';
$uploadUrl = '/img/programs/';
$imageName = $id . '_' . time() . '.webp';
$targetPath = $uploadDir . $imageName;

// Создаём папку
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

// Проверяем и конвертируем в WebP
if (!convertToWebP($_FILES['image_file']['tmp_name'], $targetPath, 85)) {
    $_SESSION['error'] = 'Не удалось загрузить или обработать изображение';
    header('Location: add.php');
    exit;
}

// Загружаем текущие программы
$programs = file_exists(ROOT_DIR . '/data/programs.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/programs.json'), true) 
    : [];

// Добавляем новую
$programs[] = [
    'id' => $id,
    'image' => $uploadUrl . $imageName,
    'title' => $title,
    'subtitle' => $subtitle,
    'description' => $description,
    'features' => $features,
    'btnText' => $btnText
];

// Сохраняем
file_put_contents(ROOT_DIR . '/data/programs.json', json_encode($programs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Программа добавлена!';
header('Location: list.php');
exit;

// Функция конвертации в WebP
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