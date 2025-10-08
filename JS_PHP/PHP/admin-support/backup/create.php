<?php
include '../config.php';
checkAuth();

if (!is_dir(BACKUP_DIR)) mkdir(BACKUP_DIR, 0777, true);

$zipFile = BACKUP_DIR . 'backup_' . date('Y-m-d_H-i-s') . '.zip';
$zip = new ZipArchive();

if ($zip->open($zipFile, ZipArchive::CREATE) !== TRUE) {
    die("Невозможно создать архив");
}

$dirs = [
    ROOT_DIR . '/data/',
    ROOT_DIR . '/img/'
];

foreach ($dirs as $dir) {
    if (is_dir($dir)) {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            $filePath = $file->getPathname();
            $localPath = str_replace(ROOT_DIR . '/', '', $filePath);
            if (is_file($filePath)) {
                $zip->addFile($filePath, $localPath);
            }
        }
    }
}

$zip->close();
sendTelegram("📦 Резервная копия создана: <code>$zipFile</code>");
header('Location: ../dashboard.php');
exit;