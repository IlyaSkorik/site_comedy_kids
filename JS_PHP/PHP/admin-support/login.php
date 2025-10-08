<?php
session_start();
if (isset($_SESSION['support']) && $_SESSION['support'] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    // Хэш пароля — сгенерирован через password_hash()
    $correctHash = '$2y$12$FaJtST09.mxlaY8zHACMZel.Z7/zTvznR/8MX7sbwnIHrP5UW9E4O'; // ← Замени на свой

    if (password_verify($password, $correctHash)) {
        $_SESSION['support'] = true;
        sendTelegram("🔐 Админка: успешный вход");
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Неверный пароль';
        sendTelegram("⚠️ Админка: ошибка входа");
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход — Поддержка</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #1a0e2e;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-box {
            background: #270e34;
            padding: 40px;
            border-radius: 15px;
            width: 320px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(139, 0, 139, 0.5);
        }
        h2 {
            margin-bottom: 20px;
            color: #d09f19;
        }
        input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 2px solid #8e10d1;
            border-radius: 10px;
            background: #1e0c2a;
            color: white;
        }
        button {
            background: #d09f19;
            color: #1a0e2e;
            border: none;
            padding: 12px;
            width: 100%;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            font-size: 1.1rem;
        }
        .error {
            color: #ff6b6b;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>🔐 Вход поддержки</h2>
        <?php if ($error): ?>
            <div class="error"><?= $error ?></div>
        <?php endif; ?>
        <form method="post">
            <input type="password" name="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
        </form>
    </div>
</body>
</html>