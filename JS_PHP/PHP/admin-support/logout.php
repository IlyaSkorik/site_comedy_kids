<?php
session_start();
unset($_SESSION['support']);
session_destroy();
header('Location: login.php');
exit;
?>