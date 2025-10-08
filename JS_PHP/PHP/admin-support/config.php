<?php
session_start();

// Корень сайта
define('ROOT_DIR', dirname(dirname(__FILE__)));

// Папки
define('DATA_DIR', ROOT_DIR . '/data/');
define('BACKUP_DIR', ROOT_DIR . '/backups/');

// Файлы
define('CONTENT_FILE', DATA_DIR . 'content.json');
define('TEAMS_FILE', DATA_DIR . 'teams.json');
define('TEACHERS_FILE', DATA_DIR . 'teachers.json');
define('PROGRAMS_FILE', DATA_DIR . 'programs.json');
define('TESTIMONIALS_FILE', DATA_DIR . 'testimonials.json');
define('CLIENT_AUTH_FILE', DATA_DIR . 'client-auth.json');

// Настройки Telegram
define('TELEGRAM_BOT_TOKEN', '8488023776:AAFwG6RxUTP3zNJBihJFOH2V51F6g9citmk'); // ← Замени на свой
define('TELEGRAM_CHAT_ID', '-1002990723498'); // ← Замени на свой

// Проверка авторизации
function checkAuth() {
    if (!isset($_SESSION['support']) || $_SESSION['support'] !== true) {
        header('Location: login.php');
        exit;
    }
}

// Отправка в Telegram
function sendTelegram($message) {
    $token = TELEGRAM_BOT_TOKEN;
    $chat_id = TELEGRAM_CHAT_ID;
    $url = "https://api.telegram.org/bot$token/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $message,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];
    file_get_contents($url . '?' . http_build_query($data));
}
?>