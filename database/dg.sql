-- ============================================================
-- DROP (orden inverso por FK)
-- ============================================================
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

-- ============================================================
-- TABLA authors
-- ============================================================
CREATE TABLE authors (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(100) NOT NULL UNIQUE,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA posts  (FK → authors)
-- ============================================================
CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  content    TEXT         NOT NULL,
  author_id  INTEGER      NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  published  BOOLEAN      DEFAULT FALSE,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED — autores
-- ============================================================
INSERT INTO authors (username, email, password_hash) VALUES
  ('john_doe',  'john.doe@example.com',  'hash_john'),
  ('ana_doe',   'ana.doe@example.com',   'hash_ana'),
  ('carlos_dev','carlos.dev@example.com','hash_carlos');

-- ============================================================
-- SEED — posts
-- ============================================================
INSERT INTO posts (title, content, author_id, published) VALUES
  ('Primer post de John',  'Contenido del primer post de John.',  1, TRUE),
  ('Segundo post de John', 'Contenido del segundo post de John.', 1, FALSE),
  ('Post de Ana',          'Contenido del post de Ana.',          2, TRUE),
  ('Post de Carlos',       'Contenido del post de Carlos.',       3, FALSE);
