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

CREATE TABLE posts (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     author_id INTEGER NOT NULL,
     published BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (title, content, author_id, published) VALUES
('First Post ', 'This is the content of the first post.', 5, TRUE);