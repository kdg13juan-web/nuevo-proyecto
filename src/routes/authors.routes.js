import { Router } from 'express';
import { getAllPosts } from '../controllers/authors.controllers.js';
import { getPost } from '../controllers/authors.controllers.js';
import { getPostId } from '../controllers/authors.controllers.js';
import { createPost } from '../controllers/authors.controllers.js';
import { putPost } from '../controllers/authors.controllers.js';
import { deletePost } from '../controllers/authors.controllers.js';

const router = Router();


router.get('/users/posts', getAllPosts);

router.get('/users/:id/posts', getPost);

router.get('/users/:id/posts/:postId', getPostId);

router.post('/users/:id/posts', createPost);

router.put('/users/:userId/posts/:postId', putPost);

router.delete('/users/:userId/posts/:postId', deletePost);

export default router;