<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$teachers = file_exists(ROOT_DIR . '/data/teachers.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/teachers.json'), true) 
    : [];
if (!is_array($teachers)) $teachers = [];

$teacherCount = count($teachers);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Преподаватели — COMEDY KIDS</title>
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
                <a href="../content/edit.php"><i class="fas fa-edit"></i> Тексты сайта</a>
                <a href="list.php" class="active"><i class="fas fa-chalkboard-teacher"></i> Преподаватели (<?= $teacherCount ?>)</a>
                <a href="../programs/list.php"><i class="fas fa-book-open"></i> Программы</a>
                <a href="../testimonials/list.php"><i class="fas fa-comments"></i> Отзывы</a>
                <a href="../logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="admin-header">
                <h1>👨‍🏫 Управление преподавателями</h1>
                <a href="add.php" class="btn btn-primary">+ Добавить преподавателя</a>
            </header>

            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert success"><?= $_SESSION['success']; unset($_SESSION['success']); ?></div>
            <?php endif; ?>

            <?php if (empty($teachers)): ?>
                <div class="card">
                    <div class="card-body">
                        <p class="empty">Нет преподавателей. <a href="add.php">Добавьте первого</a>.</p>
                    </div>
                </div>
            <?php else: ?>
                <?php foreach ($teachers as $t): ?>
                    <div class="card">
                        <div class="card-body" style="display: flex; gap: 20px; align-items: center;">
                            <img src="<?= htmlspecialchars($t['image']) ?>" alt="<?= htmlspecialchars($t['alt']) ?>" style="width: 100px; height: 130px; object-fit: cover; border-radius: 10px;">
                            <div>
                                <h3 style="color: var(--primary); margin: 0;"><?= htmlspecialchars($t['name']) ?></h3>
                                <p style="color: var(--text-light); margin: 5px 0;"><?= htmlspecialchars($t['role']) ?></p>
                                
                            </div>
                        </div>
                        <div style="margin-top: 15px; display: flex; gap: 10px;">
                            <a href="edit.php?id=<?= $t['id'] ?>" class="btn btn-outline">Редактировать</a>
                            <a href="delete.php?id=<?= $t['id'] ?>" class="btn btn-secondary" onclick="return confirm('Удалить преподавателя?')">Удалить</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </main>
    </div>
</body>
</html>