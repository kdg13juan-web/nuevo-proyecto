import {
  findAllPosts,
  findPostsByAuthorId,
  findPostById,
  insertPost,
  updatePostById,
  deletePostById
} from '../services/posts.service.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await findAllPosts();
    res.json({ total: posts.length, posts });
  } catch (err) {
    next(err);
  }
};

export const getPostsByAuthorAlt = async (req, res, next) => {
  try {
    const data = await findPostsByAuthorId(req.params.authorId);
    if (!data) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPostsByAuthor = async (req, res, next) => {
  try {
    const data = await findPostsByAuthorId(req.params.id);
    if (!data) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await findPostById(req.params.postId, req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title y content son obligatorios' });
    }
    const post = await insertPost(req.params.id, { title, content, published });
    if (!post) return res.status(404).json({ error: 'Autor no encontrado' });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title y content son obligatorios' });
    }
    const result = await updatePostById(req.params.postId, req.params.authorId, { title, content, published });
    if (result?.notFoundType === 'author') return res.status(404).json({ error: 'Autor no encontrado' });
    if (result?.notFoundType === 'post')   return res.status(404).json({ error: 'Post no encontrado' });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const result = await deletePostById(req.params.postId, req.params.authorId);
    if (result?.notFoundType === 'author') return res.status(404).json({ error: 'Autor no encontrado' });
    if (result?.notFoundType === 'post')   return res.status(404).json({ error: 'Post no encontrado' });
    res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
