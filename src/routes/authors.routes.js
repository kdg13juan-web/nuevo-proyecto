import { Router } from 'express';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../controllers/authors.controllers.js';

const router = Router();

router.get('/authors',     getAllAuthors);
router.get('/authors/:id', getAuthorById);
router.post('/authors',    createAuthor);
router.put('/authors/:id', updateAuthor);
router.delete('/authors/:id', deleteAuthor);

export default router;
