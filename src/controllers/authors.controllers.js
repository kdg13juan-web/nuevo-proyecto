import {
  findAllAuthors,
  findAuthorById,
  insertAuthor,
  updateAuthorById,
  deleteAuthorById
} from '../services/authors.service.js';

export const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await findAllAuthors();
    res.json(authors);
  } catch (err) {
    next(err);
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    const author = await findAuthorById(req.params.id);
    if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(author);
  } catch (err) {
    next(err);
  }
};

export const createAuthor = async (req, res, next) => {
  try {
    const { username, email, password_hash } = req.body;
    if (!username || !email || !password_hash) {
      return res.status(400).json({ error: 'username, email y password_hash son obligatorios' });
    }
    const author = await insertAuthor({ username, email, password_hash });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const { username, email, password_hash } = req.body;
    if (!username || !email || !password_hash) {
      return res.status(400).json({ error: 'username, email y password_hash son obligatorios' });
    }
    const author = await updateAuthorById(req.params.id, { username, email, password_hash });
    if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(author);
  } catch (err) {
    next(err);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const deleted = await deleteAuthorById(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Autor no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
