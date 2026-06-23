import { pool } from '../db.js';

// GET /authors/posts — todos los posts con datos del autor
export const getAllPosts = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        posts.id,
        posts.title,
        posts.content,
        posts.published,
        posts.created_at,
        posts.updated_at,
        authors.id       AS author_id,
        authors.username,
        authors.email
      FROM posts
      JOIN authors ON posts.author_id = authors.id
      ORDER BY posts.created_at DESC
    `);
    res.json({ total: result.rows.length, posts: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /posts/author/:authorId — requerimiento explícito del enunciado
export const getPostsByAuthorAlt = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    const authorResult = await pool.query(
      'SELECT id, username, email FROM authors WHERE id = $1',
      [authorId]
    );
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const postsResult = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [authorId]
    );

    res.json({
      author: authorResult.rows[0],
      total_posts: postsResult.rows.length,
      posts: postsResult.rows
    });
  } catch (err) {
    next(err);
  }
};

// GET /authors/:id/posts
export const getPostsByAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authorResult = await pool.query(
      'SELECT id, username, email FROM authors WHERE id = $1',
      [id]
    );
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const postsResult = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      author: authorResult.rows[0],
      total_posts: postsResult.rows.length,
      posts: postsResult.rows
    });
  } catch (err) {
    next(err);
  }
};

// GET /authors/:id/posts/:postId
export const getPostById = async (req, res, next) => {
  try {
    const { id, postId } = req.params;

    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND author_id = $2',
      [postId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /authors/:id/posts
export const createPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'title y content son obligatorios' });
    }

    const authorResult = await pool.query(
      'SELECT id FROM authors WHERE id = $1',
      [id]
    );
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, author_id, published)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, id, published ?? false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /authors/:authorId/posts/:postId
export const updatePost = async (req, res, next) => {
  try {
    const { authorId, postId } = req.params;
    const { title, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'title y content son obligatorios' });
    }

    const authorResult = await pool.query(
      'SELECT id FROM authors WHERE id = $1',
      [authorId]
    );
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const postCheck = await pool.query(
      'SELECT id FROM posts WHERE id = $1 AND author_id = $2',
      [postId, authorId]
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
  } catch (err) {
    next(err);
  }
};

// DELETE /authors/:authorId/posts/:postId
export const deletePost = async (req, res, next) => {
  try {
    const { authorId, postId } = req.params;

    const authorResult = await pool.query(
      'SELECT id FROM authors WHERE id = $1',
      [authorId]
    );
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }

    const postCheck = await pool.query(
      'SELECT id FROM posts WHERE id = $1 AND author_id = $2',
      [postId, authorId]
    );
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
