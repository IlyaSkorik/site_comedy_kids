<?php
header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__, 5) . '/cubeupby/config/encryption.php';
require_once dirname(__DIR__, 5) . '/cubeupby/config/lib/crypto.php';


// Подключение к БД
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("DB Connection Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database connection failed']);
    exit;
}

$raw = file_get_contents('php://input');
$update = json_decode($raw, true);

if (!$update) {
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}


// =============================
// 🔧 ОБРАБОТКА INLINE КНОПОК (callback_query)
// =============================
if (isset($update['callback_query'])) {
    $callback = $update['callback_query'];
    $callbackId = $callback['id'];
    $data = $callback['data'];

    if (!preg_match('/^status_(completed|spam|not_completed)_(\d+)$/', $data, $matches)) {
        answerCallbackQuery($callbackId, 'Неверная команда', true);
        http_response_code(200);
        echo json_encode(['ok' => true]);
        exit;
    }

    list(, $status, $appId) = $matches;

    $stmt = $pdo->prepare("UPDATE applications SET status = ? WHERE id = ?");
    $stmt->execute([$status, $appId]);

    if ($stmt->rowCount() === 0) {
        answerCallbackQuery($callbackId, 'Заявка не найдена', true);
        http_response_code(200);
        echo json_encode(['ok' => true]);
        exit;
    }

    // Получаем данные заявки для обновления сообщения
    $stmt = $pdo->prepare("SELECT parent_name, child_name, child_birth_date, phone, preferred_contact, source, submit_time FROM applications WHERE id = ?");
    $stmt->execute([$appId]);
    $app = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$app) {
        answerCallbackQuery($callbackId, 'Данные заявки не найдены', false);
        http_response_code(200);
        echo json_encode(['ok' => true]);
        exit;
    }

    $parentName       = decrypt($app['parent_name']);
    $childName        = decrypt($app['child_name']);
    $childBirthDate   = decrypt($app['child_birth_date']);
    $phone            = decrypt($app['phone']);
    $preferredContact = $app['preferred_contact'] ? decrypt($app['preferred_contact']) : 'Не указано';
    $submitTime       = $app['submit_time'];
    $source           = decrypt($app['source']);

    $statusText = match($status) {
        'completed' => '✅ Выполнено',
        'spam' => '❌ Спам',
        'not_completed' => '⚠️ Не выполнено'
    };

    $newMessage = "<b>📝 ЗАЯВКА №$appId</b>\n\n"
        . "👤 <b>Имя родителя:</b> " . htmlspecialchars($parentName) . "\n"
        . "👶 <b>Имя ребёнка:</b> " . htmlspecialchars($childName) . "\n"
        . "📅 <b>Дата рождения:</b> " . htmlspecialchars($childBirthDate) . "\n"
        . "📞 <b>Телефон:</b> " . htmlspecialchars($phone) . "\n"
        . ($preferredContact !== 'Не указано' ? "🕓 <b>Когда лучше связаться:</b> " . htmlspecialchars($preferredContact) . "\n" : "")
        . "🕒 <b>Время заявки:</b> " . htmlspecialchars($submitTime) . "\n"
        . "📌 <b>Источник:</b> $source\n\n"
        . "📊 <b>Статус:</b> $statusText";

    $chatId = $callback['message']['chat']['id'];
    $messageId = $callback['message']['message_id'];

    editTelegramMessage($chatId, $messageId, $newMessage, 'HTML');
    answerCallbackQuery($callbackId, 'Статус обновлён: ' . $statusText, false);

    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

// Если ничего не обработано — просто отвечаем OK
http_response_code(200);
echo json_encode(['ok' => true]);

// =============================
// 🛠 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =============================

function sendTelegramMessage($chatId, $text, $parseMode = 'HTML') {
    $url = 'https://api.telegram.org/bot' . TG_BOT_TOKEN . '/sendMessage';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => $parseMode
        ]
    ]);
    curl_exec($ch);
    curl_close($ch);
}

function answerCallbackQuery($callbackId, $text, $showAlert = false) {
    $url = 'https://api.telegram.org/bot' . TG_BOT_TOKEN . '/answerCallbackQuery';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => [
            'callback_query_id' => $callbackId,
            'text' => $text,
            'show_alert' => $showAlert
        ]
    ]);
    curl_exec($ch);
    curl_close($ch);
}

function editTelegramMessage($chatId, $messageId, $text, $parseMode = 'HTML') {
    $url = 'https://api.telegram.org/bot' . TG_BOT_TOKEN . '/editMessageText';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chatId,
            'message_id' => $messageId,
            'text' => $text,
            'parse_mode' => $parseMode
        ]
    ]);
    curl_exec($ch);
    curl_close($ch);
}