<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Подключаем конфигурации
require_once dirname(__DIR__, 5) . '/cubeupby/config/encryption.php';
require_once dirname(__DIR__, 5) . '/cubeupby/config/lib/crypto.php';

// Используем charset=utf8mb4 для полной поддержки UTF-8, включая эмодзи
$pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// Устанавливаем кодировку соединения на стороне сервера (дополнительная мера предосторожности)
$pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$required = ['parentName', 'childName', 'childBirthDate', 'phone'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => "Поле «$field» не заполнено"]);
        exit;
    }
}

// Получаем дату рождения из формы
$childBirthDateRaw = $data['childBirthDate'];

// Проверяем, что дата не пустая и имеет правильный формат (d.m.Y)
if (empty($childBirthDateRaw) || !preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $childBirthDateRaw)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Укажите корректную дату рождения ребёнка (например: 30.08.2022)']);
    exit;
}

// Преобразуем d.m.Y → Y-m-d для внутренней обработки (например, strtotime), затем обратно в d.m.Y для шифрования
$timestamp = strtotime($childBirthDateRaw);
if ($timestamp === false) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Неверный формат даты рождения']);
    exit;
}

// Форматируем дату в исходный формат перед шифрованием
$childBirthDateFormatted = date('d.m.Y', $timestamp);

// Шифруем данные для БД — ПДн остаются в безопасности
$encrypted_parentName       = encrypt(trim($data['parentName']));
$encrypted_childName        = encrypt(trim($data['childName']));
// Шифруем дату в формате d.m.Y
$encrypted_childBirthDate   = encrypt($childBirthDateFormatted);
$encrypted_phone            = encrypt(trim($data['phone']));
$encrypted_preferredContact = !empty($data['preferredContact']) ? encrypt(trim($data['preferredContact'])) : null; // Шифруем как есть, предполагая, что формат уже проверен на фронтенде или в другом месте
$encrypted_source           = encrypt(!empty($data['source']) ? trim($data['source']) : 'Не указано');

$submitTime = date('Y-m-d H:i:s');

// Сохраняем в БД (зашифрованные)
$stmt = $pdo->prepare("
    INSERT INTO applications (parent_name, child_name, child_birth_date, phone, preferred_contact, source, submit_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
    $encrypted_parentName,
    $encrypted_childName,
    $encrypted_childBirthDate,
    $encrypted_phone,
    $encrypted_preferredContact,
    $encrypted_source,
    $submitTime
]);

$appId = $pdo->lastInsertId();

// ✅ РАСШИФРОВЫВАЕМ ДЛЯ TELEGRAM — ПОЭТОМУ ВИДИТЕ ОТКРЫТЫЕ ДАННЫЕ
$parentName       = decrypt($encrypted_parentName);
$childName        = decrypt($encrypted_childName);
$childBirthDate   = decrypt($encrypted_childBirthDate);
$phone            = decrypt($encrypted_phone);
$preferredContact = $encrypted_preferredContact ? decrypt($encrypted_preferredContact) : 'Не указано';
$source           = decrypt($encrypted_source);

// ✅ Формируем сообщение в Telegram — ОТКРЫТЫЕ ДАННЫЕ + МЕСТО ДЛЯ СТАТУСА
$message = "<b>📝 НОВАЯ ЗАЯВКА: Пробное занятие</b>\n\n"
         . "👤 <b>Имя родителя:</b> " . htmlspecialchars($parentName, ENT_QUOTES, 'UTF-8') . "\n"
         . "👶 <b>Имя ребёнка:</b> " . htmlspecialchars($childName, ENT_QUOTES, 'UTF-8') . "\n"
         . "📅 <b>Дата рождения:</b> " . htmlspecialchars($childBirthDate, ENT_QUOTES, 'UTF-8') . "\n"
         . "📞 <b>Телефон:</b> " . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . "\n"
         . ($preferredContact !== 'Не указано' ? "🕓 <b>Когда лучше связаться:</b> " . htmlspecialchars($preferredContact, ENT_QUOTES, 'UTF-8') . "\n" : "")
         . "🕒 <b>Время заявки:</b> " . htmlspecialchars($submitTime, ENT_QUOTES, 'UTF-8') . "\n"
         . "ℹ️ <b>Источник:</b> " . htmlspecialchars($source, ENT_QUOTES, 'UTF-8') . "\n"
         . "📌 <b>ID заявки:</b> #$appId\n\n"
         . "📊 <b>Статус:</b> ⌛ В ожидании\n";

$keyboard = [
    'inline_keyboard' => [
        // Строка 1: Две кнопки
        [
            ['text' => '✅ Выполнено', 'callback_data' => "status_completed_$appId"],
            ['text' => '❌ Спам', 'callback_data' => "status_spam_$appId"]
        ],
        // Строка 2: Одна кнопка
        [
            ['text' => '⚠️ Не выполнено', 'callback_data' => "status_not_completed_$appId"]
        ]
    ]
];

// Исправлена строка URL - убраны лишние пробелы
$url = 'https://api.telegram.org/bot' . TG_BOT_TOKEN . '/sendMessage';

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_POSTFIELDS     => [
        'chat_id'              => TG_CHAT_ID,
        'text'                 => $message,
        'parse_mode'           => 'HTML',
        'reply_markup'         => json_encode($keyboard, JSON_UNESCAPED_UNICODE),
        'disable_web_page_preview' => true
    ],
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    error_log("cURL Error: $curlError");
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ошибка сети при отправке в Telegram']);
    exit;
}

$tgResponse = json_decode($response, true);
if (!isset($tgResponse['ok']) || !$tgResponse['ok']) {
    error_log("Telegram API Error: " . ($tgResponse['description'] ?? 'Unknown'));
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'Telegram не принял сообщение',
        'details' => $tgResponse['description'] ?? 'Unknown'
    ]);
    exit;
}

echo json_encode(['ok' => true, 'application_id' => $appId]);