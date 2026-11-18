CREATE DATABASE IF NOT EXISTS community_library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE community_library;
CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(160) NOT NULL UNIQUE,
 membership_id VARCHAR(60) NOT NULL UNIQUE,
 role ENUM('ADMIN','MEMBER') NOT NULL DEFAULT 'MEMBER',
 password_hash VARCHAR(255) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS books (
 id INT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(220) NOT NULL,
 author VARCHAR(160) NOT NULL,
 genre VARCHAR(80),
 isbn VARCHAR(40) UNIQUE,
 quantity INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CHECK (quantity >= 0)
);
CREATE TABLE IF NOT EXISTS transactions (
 id INT AUTO_INCREMENT PRIMARY KEY,
 type ENUM('BORROW','RETURN','STOCK') NOT NULL,
 book_id INT NOT NULL,
 user_id INT NULL,
 quantity INT NOT NULL,
 created_by INT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_transaction_book FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE,
 CONSTRAINT fk_transaction_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
 CONSTRAINT fk_transaction_creator FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL,
 CHECK (quantity > 0)
);
INSERT INTO books(title,author,genre,isbn,quantity) VALUES
('The Alchemist','Paulo Coelho','Fiction','9780062315007',5),
('Things Fall Apart','Chinua Achebe','African Literature','9780385474542',3),
('Introduction to Computing','Peter Norton','Technology','9780070541234',4),
('Atomic Habits','James Clear','Self-help','9780735211292',1),
('The Hobbit','J.R.R. Tolkien','Fantasy','9780547928227',2)
ON DUPLICATE KEY UPDATE title=VALUES(title);
