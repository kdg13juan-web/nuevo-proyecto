export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Email o username duplicado (PostgreSQL unique violation)
  if (err.code === '23505') {
    const field = err.detail?.includes('email') ? 'email' : 'username';
    return res.status(409).json({
      error: `El ${field} ya está en uso`
    });
  }

  // FK violation (author_id no existe)
  if (err.code === '23503') {
    return res.status(400).json({
      error: 'El autor referenciado no existe'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
};
