<?php
include '../../config.php';
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'client') {
    header('Location: ../login.php');
    exit;
}

// Генерируем ID
$programs = file_exists(ROOT_DIR . '/data/programs.json') 
    ? json_decode(file_get_contents(ROOT_DIR . '/data/programs.json'), true) 
    : [];
$id = $programs ? max(array_column($programs, 'id')) + 1 : 1;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Добавить программу — COMEDY KIDS</title>
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
                <a href="../teachers/list.php"><i class="fas fa-chalkboard-teacher"></i> Преподаватели</a>
                <a href="list.php"><i class="fas fa-book-open"></i> Программы</a>
                <a href="../testimonials/list.php" ><i class="fas fa-comments"></i> Отзывы</a>
                <a href="../logout.php" style="color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Выход</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="admin-header">
                <h1>➕ Добавить программу</h1>
                <a href="list.php" class="btn btn-secondary">Назад</a>
            </header>

            <form action="add-process.php" method="post" enctype="multipart/form-data" class="form-grid">
                <input type="hidden" name="id" value="<?= $id ?>">

                <div class="form-group">
                    <label>Изображение программы *</label>
                    <input type="file" name="image_file" accept="image/*" required>
                    <small>Поддерживаемые форматы: JPG, PNG, WEBP</small>
                </div>

                <div class="form-group">
                    <label>Название программы *</label>
                    <input type="text" name="title" required>
                </div>

                <div class="form-group">
                    <label>Подзаголовок *</label>
                    <input type="text" name="subtitle" required>
                </div>

                <div class="form-group">
                    <label>Описание *</label>
                    <textarea name="description" rows="4" required></textarea>
                </div>

                <div class="form-group">
                    <label>Что входит (по одному на строку)</label>
                    <textarea name="features" rows="6" placeholder="Театральные игры&#10;Развитие речи"></textarea>
                </div>

                <div class="form-group">
                    <label>Текст на кнопке *</label>
                    <input type="text" name="btnText" value="Записаться" required>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Сохранить программу</button>
                </div>
            </form>
        </main>
    </div>
</body>
</html>