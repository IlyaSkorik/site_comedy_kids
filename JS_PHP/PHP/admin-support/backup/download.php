<?php
include '../config.php';
checkAuth();

$file = $_GET['file'] ?? '';
$path = BACKUP_DIR . basename($file);

if (file_exists($path) && strpos($file, 'backup_') === 0) {
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . basename($path) . '"');
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
} else {
    header('Location: ../dashboard.php');
    exit;
}