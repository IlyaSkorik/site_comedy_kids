<?php
include 'config.php';
checkAuth();

$authFile = DATA_DIR . 'client-auth.json';
$auth = file_exists($authFile) ? json_decode(file_get_contents($authFile), true) : ['login' => 'client'];

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newLogin = $_POST['login'] ?? '';
    $newPassword = $_POST['password'] ?? '';

    if (empty($newLogin)) {
        $error = 'Логин не может быть пустым';
    } else {
        $hashed = !empty($newPassword) 
            ? password_hash($newPassword, PASSWORD_DEFAULT) 
            : $auth['password'];

        $updated = [
            'login' => $newLogin,
            'password' => $hashed
        ];

        file_put_contents($authFile, json_encode($updated, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        $success = 'Данные клиента обновлены!';
        sendTelegram("🔐 Админка: логин/пароль клиента изменён на <b>$newLogin</b>");
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Управление клиентом — Поддержка</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h3>🛠️ Поддержка</h3>
                <p>Админка</p>
            </div>
            <nav class="sidebar-menu">
                <a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Главная</a>
                <a href="client-auth.php" class="active"><i class="fas fa-user-lock"></i> Клиент</a>
                <a href="backup/create.php"><i class="fas fa-save"></i> Резерв</a>
                <a href="logs/view.php"><i class="fas fa-file-alt"></i> Логи</a>
                <a href="logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="admin-header">
                <h1>🔐 Доступ клиента</h1>
            </header>

            <?php if ($error): ?>
                <div class="alert error"><?= $error ?></div>
            <?php endif; ?>
            <?php if ($success): ?>
                <div class="alert success"><?= $success ?></div>
            <?php endif; ?>

            <form action="client-auth.php" method="post" class="form-grid">
                <div class="card">
                    <div class="card-body">
                        <div class="form-group">
                            <label>Логин *</label>
                            <input type="text" name="login" value="<?= htmlspecialchars($auth['login']) ?>" required>
                        </div>

                        <div class="form-group">
                            <label>Новый пароль (оставьте пустым, если не меняете)</label>
                            <input type="password" name="password" placeholder="Новый пароль">
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Сохранить доступ</button>
                </div>
            </form>
        </main>
    </div>
</body>
</html>