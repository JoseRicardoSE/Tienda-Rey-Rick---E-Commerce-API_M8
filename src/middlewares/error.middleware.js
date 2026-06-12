const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    ok: false,
    message: error.message || "Error interno del servidor.",
    errors: error.errors || null,
  });
};

export default errorMiddleware;

