import { body } from 'express-validator';

export const feedbackValidator = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString().isLength({ max: 1000 }),
];
