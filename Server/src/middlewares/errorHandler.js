import { ApiError } from '../utils/apiError.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${status} ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(status).json({
    success: false,
    message,
    errors: err.errors ?? undefined,
  });
};
