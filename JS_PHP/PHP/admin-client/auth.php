<?php
include '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit;
}

$login = $_POST['login'] ?? '';
$password = $_POST['password'] ?? '';

if (!$login || !$password) {
    $_SESSION['error'] = 'Заполните все поля';
    header('Location: login.php');
    exit;
}

$users = json_decode(file_get_contents(USERS_FILE), true);
$user = null;

foreach ($users as $u) {
    if ($u['login'] === $login && password_verify($password, $u['password'])) {
        $user = $u;
        break;
    }
}

if (!$user || $user['role'] !== 'client') {
    $_SESSION['error'] = 'Неверный логин или пароль';
    header('Location: login.php');
    exit;
}

$_SESSION['user'] = $user;
header('Location: index.php');
exit;
?>