import { pool } from '../db.js';

export const findAllAuthors = async () => {
  const result = await pool.query(
    'SELECT id, username, email, created_at FROM authors ORDER BY id'
  );
  return result.rows;
};

export const findAuthorById = async (id) => {
  const result = await pool.query(
    'SELECT id, username, email, created_at FROM authors WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const insertAuthor = async ({ username, email, password_hash }) => {
  const result = await pool.query(
    `INSERT INTO authors (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at`,
    [username, email, password_hash]
  );
  return result.rows[0];
};

export const updateAuthorById = async (id, { username, email, password_hash }) => {
  const result = await pool.query(
    `UPDATE authors
     SET username = $1, email = $2, password_hash = $3
     WHERE id = $4
     RETURNING id, username, email, created_at`,
    [username, email, password_hash, id]
  );
  return result.rows[0] || null;
};

export const deleteAuthorById = async (id) => {
  const result = await pool.query(
    'DELETE FROM authors WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
};
