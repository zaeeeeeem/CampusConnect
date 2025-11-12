import { body } from 'express-validator';

export const profileUpdateValidator = [
  body('name').optional().isLength({ min: 2, max: 100 }),
  body('department').optional().isLength({ min: 2, max: 100 }),
  body('year').optional().isInt({ min: 1, max: 6 }),
  body('bio').optional().isLength({ max: 500 }),
  body('interests').optional().isArray({ max: 20 }),
  body('interests.*').optional().isString().isLength({ min: 2, max: 50 }),
];
