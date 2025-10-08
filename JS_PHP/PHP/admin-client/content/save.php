<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: edit.php');
    exit;
}

// Только нужные поля
$content = [
    'stat_experience' => $_POST['stat_experience'] ?? '',
    'stat_students'   => $_POST['stat_students'] ?? '',
    'stat_events'     => $_POST['stat_events'] ?? '',
    'contact_phone'   => $_POST['contact_phone'] ?? '',
    'contact_address' => $_POST['contact_address'] ?? '',
    'contact_email'   => $_POST['contact_email'] ?? ''
];

// Сохраняем
file_put_contents(CONTENT_FILE, json_encode($content, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Контакты и статистика обновлены!';
header('Location: edit.php');
exit;
?>