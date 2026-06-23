import { pool } from '../db.js';

export const getAllAuthors = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM authors ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM authors WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createAuthor = async (req, res, next) => {
  try {
    const { username, email, password_hash } = req.body;

    if (!username || !email || !password_hash) {
      return res.status(400).json({
        error: 'username, email y password_hash son obligatorios'
      });
    }

    const result = await pool.query(
      `INSERT INTO authors (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password_hash } = req.body;

    if (!username || !email || !password_hash) {
      return res.status(400).json({
        error: 'username, email y password_hash son obligatorios'
      });
    }

    const result = await pool.query(
      `UPDATE authors
       SET username = $1, email = $2, password_hash = $3
       WHERE id = $4
       RETURNING id, username, email, created_at`,
      [username, email, password_hash, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM authors WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
