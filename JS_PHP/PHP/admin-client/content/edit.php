<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

// Загружаем текущие данные
if (file_exists(CONTENT_FILE)) {
    $content = json_decode(file_get_contents(CONTENT_FILE), true);
} else {
    // Дефолтные значения
    $content = [
        'stat_experience' => '7',
        'stat_students'   => '150+',
        'stat_events'     => '40+',
        'contact_phone'   => '+375 (25) 123-45-67',
        'contact_address' => 'г. Минск, ул. Воронянского',
        'contact_email'   => 'kvn@cubeup.by'
    ];
    file_put_contents(CONTENT_FILE, json_encode($content, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Редактировать контакты и статистику — COMEDY KIDS</title>
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h3>🎯 COMEDY KIDS</h3>
                <p>Админка</p>
            </div>
            <nav class="sidebar-menu">
                <a href="../index.php"><i class="fas fa-home"></i> Команды</a>
                <a href="edit.php" class="active"><i class="fas fa-edit"></i> Тексты сайта</a>
                <a href="../teachers/list.php"><i class="fas fa-chalkboard-teacher"></i> Преподаватели </a>
                <a href="../programs/list.php"><i class="fas fa-book-open"></i> Программы</a>
                <a href="../testimonials/list.php" ><i class="fas fa-comments"></i> Отзывы</a>
                <a href="../logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="admin-header">
                <h1>✏️ Контакты и статистика</h1>
                <a href="../index.php" class="btn btn-secondary">Назад</a>
            </header>

            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert success"><?= $_SESSION['success']; unset($_SESSION['success']); ?></div>
            <?php endif; ?>

            <form action="save.php" method="post" class="form-grid">
                <div class="card">
                    <div class="card-header">📊 Статистика</div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Лет опыта</label>
                            <input type="text" name="stat_experience" value="<?= htmlspecialchars($content['stat_experience']) ?>" required>
                        </div>

                        <div class="form-group">
                            <label>Учеников</label>
                            <input type="text" name="stat_students" value="<?= htmlspecialchars($content['stat_students']) ?>" required>
                        </div>

                        <div class="form-group">
                            <label>Событий в год</label>
                            <input type="text" name="stat_events" value="<?= htmlspecialchars($content['stat_events']) ?>" required>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">📞 Контакты</div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Телефон</label>
                            <input type="text" name="contact_phone" value="<?= htmlspecialchars($content['contact_phone']) ?>" required>
                        </div>

                        <div class="form-group">
                            <label>Адрес</label>
                            <input type="text" name="contact_address" value="<?= htmlspecialchars($content['contact_address']) ?>" required>
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" name="contact_email" value="<?= htmlspecialchars($content['contact_email']) ?>" required>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                </div>
            </form>
        </main>
    </div>
</body>
</html>