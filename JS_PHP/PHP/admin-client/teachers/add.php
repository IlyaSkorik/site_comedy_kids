<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

$teachers = file_exists(ROOT_DIR . '/data/teachers.json') ? json_decode(file_get_contents(ROOT_DIR . '/data/teachers.json'), true) : [];
$id = $teachers ? max(array_column($teachers, 'id')) + 1 : 1;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Добавить преподавателя — COMEDY KIDS</title>
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
                <a href="../content/edit.php"><i class="fas fa-edit"></i> Тексты сайта</a>
                <a href="list.php" class="active"><i class="fas fa-chalkboard-teacher"></i> Преподаватели </a>
                <a href="../programs/list.php"><i class="fas fa-book-open"></i> Программы</a>
                <a href="../testimonials/list.php"><i class="fas fa-comments"></i> Отзывы</a>
                <a href="../logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="admin-header">
                <h1>➕ Добавить преподавателя</h1>
                <a href="list.php" class="btn btn-secondary">Назад</a>
            </header>

            <form action="add-process.php" method="post" enctype="multipart/form-data" class="form-grid">
                <input type="hidden" name="id" value="<?= $id ?>">

                <div class="form-group">
                    <label>Имя и фамилия *</label>
                    <input type="text" name="name" required>
                </div>

                <div class="form-group">
                    <label>Должность / роль *</label>
                    <input type="text" name="role" required>
                </div>

                <div class="form-group">
                    <label>Достижения (по одному на строку)</label>
                    <textarea name="achievements" rows="4" placeholder="Чемпион Высшей лиги&#10;Лучший сценарист"></textarea>
                </div>

                <div class="form-group">
                    <label>Фото преподавателя *</label>
                    <input type="file" name="image" accept="image/*" required>
                    <small>ФОРМАТ: ".webp"</small>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Сохранить преподавателя</button>
                </div>
            </form>
        </main>
    </div>
</body>
</html>