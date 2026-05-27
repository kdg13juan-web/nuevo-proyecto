// Busca todos los posts de un autor específico
export async function getPostsByAuthor(pool, authorId) {

  // Primero verificamos que el autor exista
  const authorResult = await pool.query(
    'SELECT id FROM authors WHERE id = $1',
    [authorId]
  );

  // Si no existe, devolvemos null para manejarlo en la ruta
  if (authorResult.rows.length === 0) {
    return null;
  }

  // Si existe, traemos sus posts
  const postsResult = await pool.query(
    'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
    [authorId]
  );

  return postsResult.rows;
}