import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// RUTA 1 — todos los posts de todos los usuarios
router.get('/users/posts', async (req, res) => {
  const result = await pool.query(`
    SELECT 
      posts.id,
      posts.title,
      posts.content,
      posts.published,
      posts.created_at,
      users.username,
      users.email
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `);

  res.json({
    total: result.rows.length,
    posts: result.rows
  });
});

// RUTA 2 — posts de un usuario específico
router.get('/users/:id/posts', async (req, res) => {
  const { id } = req.params;

  const userResult = await pool.query(
    'SELECT id, username, email FROM users WHERE id = $1',
    [id]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const postsResult = await pool.query(
    'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
    [id]
  );

  res.json({
    user: userResult.rows[0],
    total_posts: postsResult.rows.length,
    posts: postsResult.rows
  });
});

// RUTA 3 — crear un post para un usuario
router.post('/users/:id/posts', async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;

  const userResult = await pool.query(
    'SELECT id FROM users WHERE id = $1',
    [id]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'title y content son obligatorios' });
  }

  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [title, content, id, published ?? false]
  );

  res.status(201).json(result.rows[0]);
});

export default router;