<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$id = $_GET['id'] ?? null;
if (!$id) {
    $_SESSION['error'] = 'Команда не найдена';
    header('Location: ../index.php');
    exit;
}

$teams = file_exists(ROOT_DIR . '/data/teams.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/teams.json'), true) 
    : [];

$team = null;
foreach ($teams as $t) {
    if ($t['id'] == $id) {
        $team = $t;
        break;
    }
}

if (!$team) {
    $_SESSION['error'] = 'Команда не найдена';
    header('Location: ../index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Редактировать команду — COMEDY KIDS</title>
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h3>🎯 COMEDY KIDS</h3>
                <p>Админка</p>
            </div>
            <nav class="sidebar-menu">
                <a href="../index.php"><i class="fas fa-home"></i> Команды</a>
                <a href="../content/edit.php"><i class="fas fa-edit"></i> Контакты и статистика</a>
                <a href="../teachers/list.php"><i class="fas fa-chalkboard-teacher"></i> Преподаватели</a>
                <a href="../programs/list.php"><i class="fas fa-book-open"></i> Программы</a>
                <a href="../testimonials/list.php"><i class="fas fa-comments"></i> Отзывы</a>
                <a href="../logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="admin-header">
                <h1>✏️ Редактировать команду</h1>
                <a href="list.php" class="btn btn-secondary">Назад</a>
            </header>

            <?php if (isset($_SESSION['error'])): ?>
                <div class="alert error"><?= $_SESSION['error']; unset($_SESSION['error']); ?></div>
            <?php endif; ?>

            <form action="edit-process.php" method="post" enctype="multipart/form-data" class="form-grid">
                <input type="hidden" name="id" value="<?= $team['id'] ?>">

                <div class="form-group">
                    <label>Текущее фото</label>
                    <img src="<?= htmlspecialchars($team['image']) ?>" alt="Текущее фото" style="max-width: 250px; border-radius: 10px;">
                </div>

                <div class="form-group">
                    <label>Заменить фото</label>
                    <input type="file" name="image_file" accept="image/*">
                    <small>Если не выбрано — фото останется прежним</small>
                </div>

                <div class="form-group">
                    <label>Название команды *</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($team['name']) ?>" required>
                </div>

                <div class="form-group">
                    <label>Описание команды *</label>
                    <input type="text" name="age" value="<?= htmlspecialchars($team['age']) ?>" required>
                </div>

                <div class="form-group">
                    <label>Достижения (по одному на строку)</label>
                    <textarea name="achievements" rows="6" placeholder="Чемпионат города, 2023&#10;Лучший номер года"><?= htmlspecialchars(implode("\n", $team['achievements'])) ?></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                </div>
            </form>
        </main>
    </div>
</body>
</html>