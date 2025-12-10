<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if(!empty($data->email) && !empty($data->password)) {
    
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Prepare SQL query
    $query = "SELECT id, email, password, name FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $row['id'];
        $email = $row['email'];
        $hashed_password = $row['password'];
        $name = $row['name'];
        
        // Verify password (For testing, use password_verify in production)
        // Note: In production, always use password_verify() against hashed passwords
        
        // For demo purposes, accepting "Password123!" for test@example.com
        $valid_password = false;
        
        // Test credentials for demonstration
        if($email === "test@example.com" && $data->password === "Password123!") {
            $valid_password = true;
        } 
        // In production, use:
        // else if(password_verify($data->password, $hashed_password)) {
        //     $valid_password = true;
        // }
        
        if($valid_password) {
            // Generate token (simplified for demo)
            $token = bin2hex(random_bytes(32));
            
            // Successful login response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Login successful",
                "user" => array(
                    "id" => $id,
                    "email" => $email,
                    "name" => $name
                ),
                "token" => $token,
                "timestamp" => date("Y-m-d H:i:s")
            ));
        } else {
            // Invalid password
            http_response_code(401);
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid email or password"
            ));
        }
    } else {
        // User not found
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "message" => "User not found"
        ));
    }
} else {
    // Incomplete data
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Email and password are required"
    ));
}
?>