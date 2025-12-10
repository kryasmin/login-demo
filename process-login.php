<?php
// This file can handle traditional form submissions
header("Content-Type: application/json");

include_once 'config/database.php';

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    if(!empty($email) && !empty($password)) {
        
        $database = new Database();
        $db = $database->getConnection();
        
        // For demo - check test credentials
        if($email === "test@example.com" && $password === "Password123!") {
            echo json_encode(array(
                "success" => true,
                "message" => "Form login successful",
                "user" => array(
                    "email" => $email,
                    "name" => "Test User"
                )
            ));
        } else {
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid credentials"
            ));
        }
        
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "Please provide email and password"
        ));
    }
    
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid request method"
    ));
}
?>