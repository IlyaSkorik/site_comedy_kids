<?php
include 'config.php';
checkAuth();
sendTelegram("✅ Админка поддержки запущена");
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Панель поддержки — COMEDY KIDS</title>
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
                <a href="dashboard.php" class="active"><i class="fas fa-tachometer-alt"></i> Главная</a>
                <a href="client-auth.php"><i class="fas fa-user-lock"></i> Доступ клиента</a>
                <a href="backup/create.php"><i class="fas fa-save"></i> Резервная копия</a>
                <a href="logs/view.php"><i class="fas fa-file-alt"></i> Логи</a>
                <a href="logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="admin-header">
                <h1>Добро пожаловать, поддержка!</h1>
            </header>

            <div class="card">
                <div class="card-body">
                    <h3>🚀 Быстрые действия</h3>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <a href="client-auth.php" class="btn btn-primary"><i class="fas fa-user-lock"></i> Сменить доступ клиента</a>
                        <a href="backup/create.php" class="btn btn-outline"><i class="fas fa-save"></i> Создать резерв</a>
                        <a href="logs/view.php" class="btn btn-secondary"><i class="fas fa-file-alt"></i> Просмотреть логи</a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>