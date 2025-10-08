<?php
session_start();
$_SESSION['cache_bust'] = time();
sendTelegram("🧹 Кэш сайта очищен");
header('Location: dashboard.php');