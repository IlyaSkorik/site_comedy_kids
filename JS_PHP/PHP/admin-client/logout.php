<?php
include '../config.php';

// Уничтожаем сессию
session_unset();
session_destroy();

// Перенаправляем на вход
header('Location: login.php');
exit;
?>