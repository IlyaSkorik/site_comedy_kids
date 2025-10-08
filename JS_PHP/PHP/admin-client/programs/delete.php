<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    $_SESSION['error'] = 'Программа не найдена';
    header('Location: list.php');
    exit;
}

$programs = file_exists(ROOT_DIR . '/data/programs.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/programs.json'), true) 
    : [];

$updatedPrograms = [];
foreach ($programs as $p) {
    if ($p['id'] != $id) {
        $updatedPrograms[] = $p;
    }
}

file_put_contents(ROOT_DIR . '/data/programs.json', json_encode($updatedPrograms, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

$_SESSION['success'] = 'Программа удалена!';
header('Location: list.php');
exit;
?>