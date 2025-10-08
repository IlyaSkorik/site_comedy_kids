<?php
// --- Пути ---
define('ROOT_DIR', dirname(__DIR__, 2));
define('DATA_DIR', ROOT_DIR . '/data/');

// --- Файлы ---
define('USERS_FILE', DATA_DIR . 'users.json');
define('TEAMS_FILE', DATA_DIR . 'teams.json');
define('CONTENT_FILE', DATA_DIR . 'content.json');
define('APPLICATIONS_FILE', DATA_DIR . 'applications.json');



// --- Помощь ---
function asset($path) {
    return '/' . ltrim($path, '/');
}

// --- Сессия ---
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>