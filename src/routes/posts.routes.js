import { Router } from 'express';
import {
  getAllPosts,
  getPostsByAuthorAlt,
  getPostsByAuthor,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/posts.controllers.js';

const router = Router();

// Rutas fijas primero (evitan conflicto con /:id)
router.get('/authors/posts',                       getAllPosts);
router.get('/posts/author/:authorId',              getPostsByAuthorAlt);

// Rutas con parámetros
router.get('/authors/:id/posts',                   getPostsByAuthor);
router.get('/authors/:id/posts/:postId',           getPostById);
router.post('/authors/:id/posts',                  createPost);
router.put('/authors/:authorId/posts/:postId',     updatePost);
router.delete('/authors/:authorId/posts/:postId',  deletePost);

export default router;
