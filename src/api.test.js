/**
 * Tests de integración — Mi Blog API
 *
 * Usan una base de datos de test separada (DB_NAME=nodepg_test).
 * Antes de correr: crear la BD y ejecutar setup.sql en ella.
 *
 * Ejecutar: npm test
 */

import request from 'supertest';
import { app }  from '../src/index.js';
import { pool } from '../src/db.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

let authorId;
let postId;

const validAuthor = {
  username:      'test_user',
  email:         'test@example.com',
  password_hash: 'hashed_password'
};

const validPost = {
  title:   'Test Post',
  content: 'Contenido del test',
  published: false
};

// Limpiar datos de test antes de cada suite
beforeAll(async () => {
  await pool.query("DELETE FROM posts   WHERE title   LIKE 'Test%'");
  await pool.query("DELETE FROM authors WHERE username LIKE 'test%'");
});

afterAll(async () => {
  await pool.query("DELETE FROM posts   WHERE title   LIKE 'Test%'");
  await pool.query("DELETE FROM authors WHERE username LIKE 'test%'");
  await pool.end();
});

// ─── AUTHORS ──────────────────────────────────────────────────────────────────

describe('AUTHORS', () => {

  // 1. GET /authors
  test('GET /authors → 200 y array', async () => {
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. POST /authors → crea autor
  test('POST /authors → 201 y devuelve el autor creado', async () => {
    const res = await request(app).post('/authors').send(validAuthor);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(validAuthor.email);
    authorId = res.body.id;
  });

  // 3. POST /authors con email duplicado → 409
  test('POST /authors con email duplicado → 409', async () => {
    const res = await request(app).post('/authors').send(validAuthor);
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  // 4. POST /authors sin campos → 400
  test('POST /authors sin campos obligatorios → 400', async () => {
    const res = await request(app).post('/authors').send({ username: 'solo_nombre' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // 5. GET /authors/:id
  test('GET /authors/:id → 200 y autor correcto', async () => {
    const res = await request(app).get(`/authors/${authorId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(authorId);
  });

  // 6. GET /authors/:id inexistente → 404
  test('GET /authors/:id inexistente → 404', async () => {
    const res = await request(app).get('/authors/999999');
    expect(res.status).toBe(404);
  });

  // 7. PUT /authors/:id
  test('PUT /authors/:id → 200 y datos actualizados', async () => {
    const res = await request(app).put(`/authors/${authorId}`).send({
      username:      'test_user_updated',
      email:         'test_updated@example.com',
      password_hash: 'new_hash'
    });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('test_user_updated');
  });

});

// ─── POSTS ────────────────────────────────────────────────────────────────────

describe('POSTS', () => {

  // 8. POST /authors/:id/posts → crea post
  test('POST /authors/:id/posts → 201 y post creado', async () => {
    const res = await request(app)
      .post(`/authors/${authorId}/posts`)
      .send(validPost);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(validPost.title);
    postId = res.body.id;
  });

  // 9. POST /authors/:id/posts sin title → 400
  test('POST /authors/:id/posts sin title → 400', async () => {
    const res = await request(app)
      .post(`/authors/${authorId}/posts`)
      .send({ content: 'sin título' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // 10. GET /authors/posts → todos los posts
  test('GET /authors/posts → 200 con estructura correcta', async () => {
    const res = await request(app).get('/authors/posts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('posts');
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  // 11. GET /posts/author/:authorId
  test('GET /posts/author/:authorId → 200 con posts del autor', async () => {
    const res = await request(app).get(`/posts/author/${authorId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('author');
    expect(res.body).toHaveProperty('posts');
  });

  // 12. GET /authors/:id/posts/:postId
  test('GET /authors/:id/posts/:postId → 200 y post correcto', async () => {
    const res = await request(app).get(`/authors/${authorId}/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(postId);
  });

  // 13. GET /authors/:id/posts/:postId inexistente → 404
  test('GET post inexistente → 404', async () => {
    const res = await request(app).get(`/authors/${authorId}/posts/999999`);
    expect(res.status).toBe(404);
  });

  // 14. PUT /authors/:authorId/posts/:postId
  test('PUT /authors/:authorId/posts/:postId → 200 y datos actualizados', async () => {
    const res = await request(app)
      .put(`/authors/${authorId}/posts/${postId}`)
      .send({ title: 'Test Post Actualizado', content: 'Nuevo contenido', published: true });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Post Actualizado');
    expect(res.body.published).toBe(true);
  });

  // 15. DELETE /authors/:authorId/posts/:postId
  test('DELETE /authors/:authorId/posts/:postId → 200', async () => {
    const res = await request(app)
      .delete(`/authors/${authorId}/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  // 16. DELETE post ya eliminado → 404
  test('DELETE post ya eliminado → 404', async () => {
    const res = await request(app)
      .delete(`/authors/${authorId}/posts/${postId}`);
    expect(res.status).toBe(404);
  });

});

// ─── DELETE AUTHOR ────────────────────────────────────────────────────────────

describe('DELETE AUTHOR', () => {

  // 17. DELETE /authors/:id
  test('DELETE /authors/:id → 204', async () => {
    const res = await request(app).delete(`/authors/${authorId}`);
    expect(res.status).toBe(204);
  });

  // 18. DELETE autor inexistente → 404
  test('DELETE autor inexistente → 404', async () => {
    const res = await request(app).delete('/authors/999999');
    expect(res.status).toBe(404);
  });

});
