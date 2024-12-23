<?php
// Enable error reporting for debugging purposes
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database credentials
$host = 'localhost'; // Database host
$dbname = 'steganography_db'; // Database name
$username = 'root'; // Database username
$password = 'your-password'; // Database password

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $inputUsername = $_POST['username'];
    $inputPassword = $_POST['password'];

    // Prepare and bind
    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $inputUsername);

    // Execute the statement
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if any row returned
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verify the password
        if (password_verify($inputPassword, $row['password'])) {
            // Redirect to home.html
            header("Location: home.html");
            exit(); // Always call exit after header redirect
        } else {
            // Incorrect password
            header("Location: login.html?error=1");
            exit(); // Always call exit after header redirect
        }
    } else {
        // Username does not exist
        header("Location: login.html?error=1");
        exit(); // Always call exit after header redirect
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
