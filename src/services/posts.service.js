import { pool } from '../db.js';

export const findAllPosts = async () => {
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
  return result.rows;
};

export const findPostsByAuthorId = async (authorId) => {
  const authorResult = await pool.query(
    'SELECT id, username, email FROM authors WHERE id = $1',
    [authorId]
  );
  if (authorResult.rows.length === 0) return null;

  const postsResult = await pool.query(
    'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
    [authorId]
  );

  return {
    author: authorResult.rows[0],
    total_posts: postsResult.rows.length,
    posts: postsResult.rows
  };
};

export const findPostById = async (postId, authorId) => {
  const result = await pool.query(
    'SELECT * FROM posts WHERE id = $1 AND author_id = $2',
    [postId, authorId]
  );
  return result.rows[0] || null;
};

export const insertPost = async (authorId, { title, content, published }) => {
  const authorResult = await pool.query(
    'SELECT id FROM authors WHERE id = $1',
    [authorId]
  );
  if (authorResult.rows.length === 0) return null;

  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, authorId, published ?? false]
  );
  return result.rows[0];
};

export const updatePostById = async (postId, authorId, { title, content, published }) => {
  const authorResult = await pool.query(
    'SELECT id FROM authors WHERE id = $1',
    [authorId]
  );
  if (authorResult.rows.length === 0) return { notFoundType: 'author' };

  const postCheck = await pool.query(
    'SELECT id FROM posts WHERE id = $1 AND author_id = $2',
    [postId, authorId]
  );
  if (postCheck.rows.length === 0) return { notFoundType: 'post' };

  const result = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2, published = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, content, published ?? false, postId]
  );
  return result.rows[0];
};

export const deletePostById = async (postId, authorId) => {
  const authorResult = await pool.query(
    'SELECT id FROM authors WHERE id = $1',
    [authorId]
  );
  if (authorResult.rows.length === 0) return { notFoundType: 'author' };

  const postCheck = await pool.query(
    'SELECT id FROM posts WHERE id = $1 AND author_id = $2',
    [postId, authorId]
  );
  if (postCheck.rows.length === 0) return { notFoundType: 'post' };

  await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
  return { deleted: true };
};
