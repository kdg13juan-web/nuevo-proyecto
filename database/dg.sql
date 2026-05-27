CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255) NOT NULL UNIQUE,
     email VARCHAR(255) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash) VALUES
('john_doe', 'john.doe@example.com', '12345678');

INSERT INTO users (username, email, password_hash) VALUES
('ANA_doe', 'ana.doe@example.com', '12345678');

SELECT * FROM users;