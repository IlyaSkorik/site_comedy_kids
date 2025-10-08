<?php
include '../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: login.php');
    exit;
}

$teams = file_exists(TEAMS_FILE) ? json_decode(file_get_contents(TEAMS_FILE), true) : [];
if (!is_array($teams)) $teams = [];

$teamCount = count($teams);
$applications = file_exists(APPLICATIONS_FILE) ? json_decode(file_get_contents(APPLICATIONS_FILE), true) : [];
if (!is_array($applications)) $applications = [];
$appCount = count($applications);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Админка — COMEDY KIDS</title>
    <link rel="stylesheet" href="css/style.css">
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
                <a href="index.php" class="active"><i class="fas fa-home"></i> Команды </a>
                <a href="content/edit.php"><i class="fas fa-edit"></i> Тексты сайта</a>
                <a href="teachers/list.php" ><i class="fas fa-chalkboard-teacher"></i> Преподаватели </a>
                <a href="programs/list.php"><i class="fas fa-book-open"></i> Программы</a>
                <a href="testimonials/list.php"><i class="fas fa-comments"></i> Отзывы</a>
                <a href="logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="admin-header">
                <h1>Управление командами</h1>
                <a href="teams/add.php" class="btn btn-primary">+ Добавить команду</a>
            </header>

            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert success"><?= $_SESSION['success']; unset($_SESSION['success']); ?></div>
            <?php endif; ?>

            <?php if (empty($teams)): ?>
                <div class="card">
                    <div class="card-body">
                        <p class="empty">Нет добавленных команд. <a href="teams/add.php">Добавьте первую</a>.</p>
                    </div>
                </div>
            <?php else: ?>
                <?php foreach ($teams as $team): ?>
                    <div class="card">
                        <div class="card-body">
                            <div style="display: flex; gap: 20px; align-items: center;">
                                <img src="<?= htmlspecialchars($team['image']) ?>" alt="<?= htmlspecialchars($team['title']) ?>" style="width: 120px; height: 90px; object-fit: cover; border-radius: 10px;">
                                <div>
                                    <h3 style="color: var(--primary); margin: 0;"><?= htmlspecialchars($team['title']) ?></h3>
                                    <p style="color: var(--text-light); margin: 5px 0;"><?= htmlspecialchars(mb_strimwidth($team['age'], 0, 100, '...')) ?></p>
                                </div>
                            </div>
                            <div style="margin-top: 15px; display: flex; gap: 10px;">
                                <a href="teams/edit.php?id=<?= $team['id'] ?>" class="btn btn-outline">Редактировать</a>
                                <a href="teams/delete.php?id=<?= $team['id'] ?>" class="btn btn-secondary" onclick="return confirm('Удалить команду?')">Удалить</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </main>
    </div>
</body>
</html>