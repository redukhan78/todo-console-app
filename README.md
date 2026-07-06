# 📝 Console Todo App

A simple console-based TODO application built with Node.js and MySQL.

## 🚀 Features

- User Registration & Login
- Task Management (CRUD)
- Task Search
- Password Encryption
- MySQL Database Integration

## 🛠️ Technologies

- **Node.js** - Runtime environment
- **MySQL** - Database
- **bcrypt** - Password hashing
- **readline-sync** - Console input handling

## 📋 Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- DBeaver (optional)

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-console-app.git
cd todo-console-app
```
2. Install Dependencies
```bash
npm install
```
3. Set up environment variables
```bash
cp .env.example .env
# Update .env with your database credentials
```
4. Run database migrations (using DBeaver or MySQL CLI)
```sql
-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Step 2: Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 3: Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 4: Verify tables were created
SHOW TABLES;

-- Step 5: Check table structures
DESCRIBE users;
DESCRIBE tasks;

-- Step 6: Insert a test user (optional - for testing)
INSERT INTO users (name, email, password) VALUES 
('Test User', 'test@test.com', 'password123');

-- Step 7: Verify data
SELECT * FROM users;

-- Step 8: Show success message
SELECT 'Database setup completed successfully!' AS Status;
```

5. Start the application
```bash
npm start
```
## Workflow Video
```
https://github.com/user-attachments/assets/47d5998f-67da-4a66-999b-b141cd4bef92
```
Added the video just copy and paste it to the browser to watch






