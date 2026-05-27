import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Todos los posts de todos los usuarios
router.get('/users/posts', async (req, res) => {
  const result = await pool.query(`
    SELECT 
      posts.title,
      posts.content,
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



router.get('/users/posts/:id', async (req, res) => {
  const { id } = req.params;

  // Verificar que el usuario existe
  const userResult = await pool.query(
    'SELECT id, username, email FROM users WHERE id = $1',
    [id]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Traer sus posts
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

export default router;