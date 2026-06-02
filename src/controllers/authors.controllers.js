import { pool } from '../db.js';

export const getAllPosts = async (req, res) => {
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
};

export const getPost= async (req, res) => {
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
};

export const getPostId = async (req, res) => {
  const { id, postId } = req.params;

  const postResult = await pool.query(
    'SELECT * FROM posts WHERE id = $1 AND author_id = $2',
    [postId, id]
  );

  if (postResult.rows.length === 0) {
    return res.status(404).json({ error: 'Post no encontrado' });
  }

  res.json(postResult.rows[0]);
};

export const createPost = async (req, res) => {
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
};

export const putPost = async (req, res) => {
  const { postId, userId } = req.params;
  const { title, content, published } = req.body;

  const userResult = await pool.query(
    'SELECT id FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'title y content son obligatorios' });
  }
  const postCheck = await pool.query(
    'SELECT id FROM posts WHERE id = $1 AND author_id = $2',
    [postId, userId]
  );

  if (postCheck.rows.length === 0) {
    return res.status(404).json({ error: 'Post no encontrado' });
  }

  const result = await pool.query(
    `UPDATE posts 
     SET title = $1, content = $2, published = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, content, published ?? false, postId]
  );

  res.status(200).json(result.rows[0]);
};

export const deletePost = async (req, res) => {
  const { postId, userId } = req.params;

  const userResult = await pool.query(
    'SELECT id FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const postCheck = await pool.query(
    'SELECT id FROM posts WHERE id = $1 AND author_id = $2',
    [postId, userId]
  );

  if (postCheck.rows.length === 0) {
    return res.status(404).json({ error: 'Post no encontrado' });
  }

  await pool.query(
    'DELETE FROM posts WHERE id = $1',
    [postId]
  );

  res.status(200).json({ message: 'Post eliminado correctamente' });
};

