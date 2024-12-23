<?php
// register.php
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Check if passwords match
    if ($password !== $confirm_password) {
        header("Location: register.html?password_error=1");
        exit();
    }

    // Check if username already exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        header("Location: register.html?username_error=1");
        exit();
    }

    // Insert the new user into the database
    $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Hash the password
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $hashed_password]);

    // Redirect to login page upon successful registration
    header("Location: login.html");
    exit();
}
?>