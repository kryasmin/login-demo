-- Create database
CREATE DATABASE IF NOT EXISTS login_system;
USE login_system;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample user (password: Password123!)
INSERT INTO users (email, password, name) 
VALUES ('user@example.com', '$2y$10$YourHashedPasswordHere', 'John Doe');

-- For testing, you can use this actual hash for 'Password123!'
-- INSERT INTO users (email, password, name) 
-- VALUES ('test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User');