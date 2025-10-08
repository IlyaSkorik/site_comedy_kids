<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include '../config.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход в админку — COMEDY KIDS</title>
    <style>
        body {
            font-family: 'Dela_Gothic_One', sans-serif;
            background: #1a0e2e;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .login-container {
            background: #270e34;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(139, 0, 139, 0.4);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .login-header h2 {
            font-size: 2rem;
            margin-bottom: 10px;
            color: #d09f19;
        }
        .login-header p {
            color: #aaa;
        }
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #5a3c7d;
            border-radius: 10px;
            background: #1e0c2a;
            color: white;
            font-size: 1rem;
        }
        .form-group input:focus {
            outline: none;
            border-color: #d09f19;
        }
        .btn-primary {
            background: #d09f19;
            color: #1a0e2e;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
        }
        .btn-primary:hover {
            background: #e0b02a;
        }
        .alert.error {
            background: #ff6b6b;
            color: white;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .login-footer {
            margin-top: 20px;
            font-size: 0.9rem;
            color: #aaa;
        }
        .login-footer a {
            color: #d09f19;
            text-decoration: none;
        }
        .login-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h2>🔐 Вход в админку</h2>
            <p>COMEDY KIDS —  творческое пространство</p>
        </div>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="alert error"><?= $_SESSION['error']; unset($_SESSION['error']); ?></div>
        <?php endif; ?>

        <form action="auth.php" method="post" class="login-form">
            <div class="form-group">
                <label>Логин</label>
                <input type="text" name="login" required autofocus>
            </div>
            <div class="form-group">
                <label>Пароль</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Войти</button>
        </form>

        <p class="login-footer">
            Админка поддержки: <a href="../admin-support/login.php">Вход</a>
        </p>
    </div>
</body>
</html>